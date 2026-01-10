import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly authToken = environment.authToken;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    });
  }

  constructor(private http: HttpClient) { }

  /**
   * Get all messages from the API
   * Requires Bearer token authentication as per backend API spec
   */
  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Send a new message to the API
   * @param message - The message text
   * @param author - The author name
   * @returns Observable with the created message
   */
  sendMessage(message: string, author: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/messages`,
      { message, author },
      { headers: this.getHeaders() }
    );
  }
}
