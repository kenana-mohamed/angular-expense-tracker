import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { ChatbotResponse } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { AiChatbotService } from '../../services/ai-chatbot.service';

type ChatMessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: number;
  role: ChatMessageRole;
  content: string;
  createdAt: Date;
}

/**
 * Floating AI assistant widget (bottom-right corner).
 *
 * Posts the user's message plus the current expenses to the n8n webhook
 * through `AiChatbotService` and renders the streaming-style chat history.
 */
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent {
  private readonly aiChatbotService = inject(AiChatbotService);
  readonly expenseService = inject(ExpenseService);

  /** Stable id for this browser session, passed to the n8n workflow. */
  private readonly sessionId = `expense-chat-${Math.random().toString(36).slice(2, 10)}`;
  private nextMessageId = 2;

  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hi! I can help you understand your spending and answer questions about your expenses.',
      createdAt: new Date(),
    },
  ]);

  private readonly messageHistory =
    viewChild<ElementRef<HTMLElement>>('messageHistory');

  private readonly scrollToBottom = effect(() => {
    // Re-run whenever the conversation, loading state or window changes.
    this.messages();
    this.isLoading();
    this.isOpen();

    queueMicrotask(() => {
      const history = this.messageHistory()?.nativeElement;
      if (history) {
        history.scrollTop = history.scrollHeight;
      }
    });
  });

  toggleChat(): void {
    this.isOpen.update((open) => !open);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  onDraftChange(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  sendMessage(event?: Event): void {
    event?.preventDefault();

    const query = this.draft().trim();

    if (!query || this.isLoading()) {
      return;
    }

    this.errorMessage.set('');
    this.addMessage('user', query);
    this.draft.set('');
    this.isLoading.set(true);

    this.aiChatbotService
      .sendMessage(query, this.sessionId, this.expenseService.expenses())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: ChatbotResponse) => {
          this.addMessage('assistant', response.reply);
        },
        error: (err: unknown) => {
          console.error('Chatbot request failed:', err);
          this.errorMessage.set(
            'I could not process that request right now. Please try again.',
          );
        },
      });
  }

  private addMessage(role: ChatMessageRole, content: string): void {
    this.messages.update((messages) => [
      ...messages,
      { id: this.nextMessageId++, role, content, createdAt: new Date() },
    ]);
  }
}