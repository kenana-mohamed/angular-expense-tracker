import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AiChatbotService } from './ai-chatbot.service';
import { ChatbotResponse } from '../models/expense.model';
import { environment } from '../../environments/environment';

describe('AiChatbotService', () => {
  let service: AiChatbotService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AiChatbotService);
    httpTesting = TestBed.inject(HttpTestingController);

    // The error path logs to the console before returning the fallback reply.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    httpTesting.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('posts the message payload and returns the reply', () => {
    let response: ChatbotResponse | undefined;

    service
      .sendMessage('How much did I spend on food?', 'session-1', [
        { id: '1', amount: 50, category: 'Food', date: '2026-09-01' },
      ])
      .subscribe((result) => {
        response = result;
      });

    const request = httpTesting.expectOne(environment.aiAgentWebhookUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      message: 'How much did I spend on food?',
      sessionId: 'session-1',
      expenses: [{ id: '1', amount: 50, category: 'Food', date: '2026-09-01' }],
    });

    request.flush({ reply: 'You spent EGP 50 on food.' });

    expect(response?.reply).toBe('You spent EGP 50 on food.');
  });

  it('returns a graceful fallback when the webhook fails', () => {
    let response: ChatbotResponse | undefined;

    service.sendMessage('hello', 'session-1', []).subscribe((result) => {
      response = result;
    });

    httpTesting
      .expectOne(environment.aiAgentWebhookUrl)
      .error(new ProgressEvent('network error'));

    expect(response?.reply).toBeTruthy();
  });
});