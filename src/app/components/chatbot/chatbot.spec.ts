import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ChatbotComponent } from './chatbot';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts closed with a welcome message', () => {
    expect(component.isOpen()).toBe(false);
    expect(component.messages().length).toBe(1);
    expect(component.messages()[0].role).toBe('assistant');
  });

  it('toggles the chat window', () => {
    component.toggleChat();
    expect(component.isOpen()).toBe(true);

    component.closeChat();
    expect(component.isOpen()).toBe(false);
  });

  it('ignores empty messages', () => {
    component.draft.set('   ');
    component.sendMessage();
    expect(component.messages().length).toBe(1);
  });
});