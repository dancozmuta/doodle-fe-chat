import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MessageService } from './services/message.service';
import { Message } from './models/message.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  currentUser: string = 'Dan C';
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeToMessageState();
    this.messageService.initialize();
    
    setTimeout(() => {
      this.messageService.scrollToBottom();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Subscribe to message service observables
   */
  private subscribeToMessageState(): void {
    this.messageService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        this.cdr.detectChanges();
      });

    this.messageService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
        this.cdr.detectChanges();
      });

    this.messageService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
        this.cdr.detectChanges();
      });
  }

  /**
   * Handle message sent from chat composer
   */
  onMessageSent(event: { message: string; author: string }): void {
    this.messageService.sendMessage(event.message, event.author).subscribe({
      next: () => {
        setTimeout(() => {
          this.messageService.scrollToBottom();
        }, 100);
      },
      error: () => {
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Retry loading messages
   */
  loadMessages(): void {
    this.messageService.loadMessages();
  }

}
