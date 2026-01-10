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
   * Determine spacing class based on message position
   * Returns 'spacing-received' for same-side messages, 'spacing-mixed' for different sides
   */
  getSpacingClass(index: number): string {
    if (index === this.messages.length - 1) {
      return '';
    }

    const currentIsOwn = this.isOwnMessage(this.messages[index]);
    const nextIsOwn = this.isOwnMessage(this.messages[index + 1]);

    if (currentIsOwn === nextIsOwn) {
      return 'spacing-received';
    } else {
      return 'spacing-mixed';
    }
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
