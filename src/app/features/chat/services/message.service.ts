import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  Subject,
  timer,
  switchMap,
  catchError,
  EMPTY,
  fromEvent,
} from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ChatApiService } from "./chat-api.service";
import { Message } from "../models/message.model";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private readonly POLL_INTERVAL = 2000;
  private readonly destroy$ = new Subject<void>();
  private isPageVisible = true;

  private readonly messagesSubject = new BehaviorSubject<Message[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor(private chatApiService: ChatApiService) {
    this.setupPageVisibilityListener();
  }

  /**
   * Cleanup method - should be called when service is no longer needed
   * For root-level service, this would be on app destruction
   */
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.messagesSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }

  /**
   * Initialize the service - load messages and start polling
   */
  initialize(): void {
    this.loadMessages();
    this.startPolling();
  }

  /**
   * Load initial messages from the API
   */
  loadMessages(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.chatApiService.getMessages().subscribe({
      next: (messages) => {
        const sortedMessages = this.sortMessagesChronologically(messages);
        this.messagesSubject.next(sortedMessages);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        this.errorSubject.next("Failed to load messages. Please try again.");
        this.loadingSubject.next(false);
      },
    });
  }

  /**
   * Send a new message
   */
  sendMessage(message: string, author: string): Observable<Message> {
    return new Observable((observer) => {
      this.chatApiService.sendMessage(message, author).subscribe({
        next: (newMessage) => {
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, newMessage]);
          observer.next(newMessage);
          observer.complete();
        },
        error: (error) => {
          this.errorSubject.next("Failed to send message. Please try again.");
          observer.error(error);
        },
      });
    });
  }

  /**
   * Get current messages array (synchronous access)
   */
  getMessages(): Message[] {
    return this.messagesSubject.value;
  }

  /**
   * Check if user is scrolled to the bottom of the message container
   */
  isScrolledToBottom(): boolean {
    const messagesContainer = document.querySelector(".message-list");
    if (!messagesContainer) {
      return true;
    }

    const threshold = 100;
    const isAtBottom =
      messagesContainer.scrollHeight - messagesContainer.scrollTop <=
      messagesContainer.clientHeight + threshold;

    return isAtBottom;
  }

  /**
   * Scroll message container to bottom
   */
  scrollToBottom(): void {
    const messagesContainer = document.querySelector(".message-list");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  /**
   * Start polling for new messages
   */
  private startPolling(): void {
    timer(0, this.POLL_INTERVAL)
      .pipe(
        switchMap(() => {
          if (!this.isPageVisible || this.loadingSubject.value) {
            return EMPTY;
          }

          const mostRecentMessage = this.getMostRecentMessage();
          if (!mostRecentMessage) {
            return EMPTY;
          }

          return this.chatApiService
            .getMessages({
              after: mostRecentMessage.createdAt,
              limit: 50,
            })
            .pipe(
              catchError((error) => {
                return EMPTY;
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (newMessages) => {
          if (newMessages && newMessages.length > 0) {
            this.mergeNewMessages(newMessages);
          }
        },
      });
  }

  /**
   * Setup Page Visibility API listener to pause/resume polling
   */
  private setupPageVisibilityListener(): void {
    if (typeof document !== "undefined") {
      this.isPageVisible = !document.hidden;

      fromEvent(document, "visibilitychange")
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.isPageVisible = !document.hidden;
        });
    }
  }

  /**
   * Get the most recent message for polling
   */
  private getMostRecentMessage(): Message | null {
    const messages = this.messagesSubject.value;
    if (messages.length === 0) {
      return null;
    }
    return messages[messages.length - 1];
  }

  /**
   * Merge new messages into existing array, avoiding duplicates
   * Maintains chronological order
   */
  private mergeNewMessages(newMessages: Message[]): void {
    if (newMessages.length === 0) {
      return;
    }

    const sortedNewMessages = this.sortMessagesChronologically(newMessages);
    const currentMessages = this.messagesSubject.value;
    const existingIds = new Set(
      currentMessages.map((m) => m._id).filter(Boolean)
    );

    const uniqueNewMessages = sortedNewMessages.filter((msg) => {
      if (msg._id && existingIds.has(msg._id)) {
        return false;
      }
      if (!msg._id) {
        return !currentMessages.some(
          (existing) =>
            existing.createdAt === msg.createdAt &&
            existing.author === msg.author &&
            existing.message === msg.message
        );
      }
      return true;
    });

    if (uniqueNewMessages.length === 0) {
      return;
    }

    const wasAtBottom = this.isScrolledToBottom();
    const mergedMessages = [...currentMessages];

    for (const newMsg of uniqueNewMessages) {
      const insertIndex = this.findInsertionIndex(mergedMessages, newMsg);
      if (insertIndex === mergedMessages.length) {
        mergedMessages.push(newMsg);
      } else if (!this.isDuplicate(mergedMessages[insertIndex], newMsg)) {
        mergedMessages.splice(insertIndex, 0, newMsg);
      }
    }

    this.messagesSubject.next(mergedMessages);

    if (wasAtBottom) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  /**
   * Find the correct insertion index to maintain chronological order
   */
  private findInsertionIndex(messages: Message[], newMessage: Message): number {
    const newTimestamp = new Date(newMessage.createdAt).getTime();

    for (let i = 0; i < messages.length; i++) {
      const existingTimestamp = new Date(messages[i].createdAt).getTime();
      if (newTimestamp < existingTimestamp) {
        return i;
      }
    }

    return messages.length;
  }

  /**
   * Check if two messages are duplicates
   */
  private isDuplicate(msg1: Message, msg2: Message): boolean {
    if (msg1._id && msg2._id) {
      return msg1._id === msg2._id;
    }
    return (
      msg1.createdAt === msg2.createdAt &&
      msg1.author === msg2.author &&
      msg1.message === msg2.message
    );
  }

  /**
   * Sort messages chronologically (oldest first, newest last)
   * API returns in reverse chronological order
   */
  private sortMessagesChronologically(messages: Message[]): Message[] {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  }
}
