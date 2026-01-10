import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatApiService } from './services/chat-api.service';
import { Message } from './models/message.model';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  messages: Message[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  currentUser: string = 'Dan C';

  constructor(
    private chatApiService: ChatApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  /**
   * Load messages from the API
   */
  loadMessages(): void {
    this.isLoading = true;
    this.error = null;

    this.chatApiService.getMessages().subscribe({
      next: (messages) => {
        console.log('Messages received:', messages);
        console.log('Number of messages:', messages.length);
        // API returns reverse chronological, sort to chronological order
        this.messages = this.sortMessagesChronologically(messages);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
        this.error = 'Failed to load messages. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Handle message sent from chat composer
   */
  onMessageSent(event: { message: string; author: string }): void {
    this.chatApiService.sendMessage(event.message, event.author).subscribe({
      next: (newMessage) => {
        console.log('Message sent successfully:', newMessage);
        this.messages = [...this.messages, newMessage];
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.error = 'Failed to send message. Please try again.';
        this.cdr.detectChanges();
      }
    });
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

  private scrollToBottom(): void {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

}
