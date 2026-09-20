import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import {
  ChatbotRequest,
  ChatbotResponse,
  Expense,
} from '../models/expense.model';
import { environment } from '../../environments/environment';

/**
 * Talks to the configured n8n webhook endpoint.
 *
 * The backend is expected to receive an n8n-style payload
 * `{ message, sessionId, expenses }` and reply with `{ reply }`.
 */
@Injectable({
  providedIn: 'root',
})
export class AiChatbotService {
  private readonly http = inject(HttpClient);
  private readonly webhookUrl = environment.aiAgentWebhookUrl;

  sendMessage(
    message: string,
    sessionId: string,
    expenses: Expense[],
  ): Observable<ChatbotResponse> {
    const payload: ChatbotRequest = { message, sessionId, expenses };

    return this.http.post<ChatbotResponse>(this.webhookUrl, payload).pipe(
      catchError((err: unknown) => {
        console.error('AI chatbot request failed:', err);

        // Graceful fallback so the chat UI can still respond if n8n is down.
        return of<ChatbotResponse>({
          reply:
            'I could not reach the assistant right now. Please make sure the n8n webhook is running and try again in a moment.',
        });
      }),
    );
  }
}