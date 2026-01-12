import { Component, Input, ChangeDetectionStrategy, AfterViewChecked, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageListComponent implements AfterViewChecked, OnChanges {
  @Input() messages: Message[] = [];
  @Input() currentUser: string = 'You';
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  
  private shouldScrollToBottom: boolean = false;

  isOwnMessage(message: Message): boolean {
    return message.author === this.currentUser;
  }

  /**
   * Check if message should have separated spacing (16px)
   * Returns true when side changes from previous message
   */
  isSeparated(index: number): boolean {
    if (index === 0) {
      return false;
    }

    const prevMessage = this.messages[index - 1];
    const currentMessage = this.messages[index];

    return this.isOwnMessage(prevMessage) !== this.isOwnMessage(currentMessage);
  }

  /**
   * TrackBy function for performance optimization with @for control flow
   */
  trackByMessageId(message: Message): string {
    return message._id || message.createdAt + message.author;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  ngOnChanges(): void {
    this.shouldScrollToBottom = true;
  }
}
