import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';
import { GetMessagesParams } from '../models/message-api.model';

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
   * Get messages from the API with optional pagination
   * @param params - Query parameters (after, before, limit)
   * @returns Observable with messages array
   */
  getMessages(params?: GetMessagesParams): Observable<Message[]> {
    let httpParams = new HttpParams();
    
    if (params?.after) {
      httpParams = httpParams.set('after', params.after);
    }
    if (params?.before) {
      httpParams = httpParams.set('before', params.before);
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<Message[]>(`${this.apiUrl}/messages`, {
      headers: this.getHeaders(),
      params: httpParams
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
