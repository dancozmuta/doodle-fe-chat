import { Component, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-composer',
  standalone: false,
  templateUrl: './chat-composer.component.html',
  styleUrls: ['./chat-composer.component.scss']
})
export class ChatComposerComponent {
  @Output() messageSent = new EventEmitter<{ message: string; author: string }>();
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef<HTMLTextAreaElement>;
  
  message: string = '';
  author: string = 'Dan C';
  isSending: boolean = false;
  private _canSend: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  onSubmit(): void {
    const trimmedMessage = this.message.trim();
    
    if (!trimmedMessage || this.isSending) {
      return;
    }

    this.isSending = true;
    this._canSend = false;
    
    this.messageSent.emit({
      message: trimmedMessage,
      author: this.author
    });

    this.message = '';
    this.isSending = false;
    this._canSend = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.canSend) {
        this.onSubmit();
      }
    }
  }

  onInput(): void {
    const trimmedLength = this.message.trim().length;
    this._canSend = trimmedLength > 0 && !this.isSending;
  }

  get canSend(): boolean {
    return this._canSend;
  }
}
