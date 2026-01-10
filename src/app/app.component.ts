import { Component, OnInit } from '@angular/core';
import { ChatApiService } from './services/chat-api.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private chatApiService: ChatApiService) {}

  ngOnInit(): void {
    // Test API connection and log messages
    this.chatApiService.getMessages().subscribe({
      next: (messages) => {
        console.log('Messages received:', messages);
        console.log('Number of messages:', messages.length);
      },
      error: (error) => {
        console.error('Error fetching messages:', error);
      }
    });
  }
}
