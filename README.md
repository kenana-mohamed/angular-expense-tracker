# 💰 Expense Tracker

A modern, single-page **Expense Tracker** built with **Angular standalone components**, **Angular Signals**, and **Reactive Forms** — wrapped in a premium **dark glassmorphism** UI and backed by a **json-server** REST API plus an **AI Chatbot** powered by **n8n** and **Google Gemini / generative LLM models**.

Track your spending, filter and sort it in real time, edit records, and ask a floating AI assistant questions about your expenses — all from one dashboard.

---

## ✨ Overview

The app is a self-contained Angular 22 application (standalone components, no `NgModule`s) that talks to two local back-ends:

| Back-end | Role | Endpoint |
| --- | --- | --- |
| **json-server** | Mock REST API for expense CRUD | `http://localhost:3000/expenses` |
| **n8n** | AI agent webhook (LangChain AI Agent + chat-LLM) | `http://localhost:5678/webhook/expense-chatbot` |

State management is handled with **Signals** (`signal`, `computed`, `effect`) — no extra state library required. The layout is a two-column glass dashboard: the **Add/Edit Expense** form on the left, the **Expense List** with live filtering/sorting on the right, and the **Chatbot** floating in the bottom-right corner.

The bundled n8n workflow (`n8n-workflow.json`) uses n8n's LangChain **AI Agent**, which you connect to a generative **chat-LLM** node of your choice. **Google Gemini** (Gemini Chat Model) is the recommended backend, and any other n8n-supported LLM — OpenAI, Anthropic, and similar — works as well. See [AI Chatbot setup](#-ai-chatbot-setup).

---

## 🚀 Features

### Core CRUD
- ➕ **Add expenses** — validated Reactive Form (amount, category, date, optional note).
- ✏️ **Edit expenses** — the same form switches to *Edit* mode and back-fills the record; supports **Cancel**.
- 🗑️ **Delete expenses** — with a confirmation prompt; works for both seeded and newly added (generated-ID) records.
- 🔄 **Auto-refresh** — the list and running totals update reactively after every operation via Signals.

### Filtering & Sorting
- 🗂️ **Category filter** — Food, Transport, Shopping, Bills, Entertainment, Other (or *All*).
- 🔍 **Note search** — free-text search over expense notes.
- 📅 **Sort controls** — sort by **date** or **amount**, ascending or descending.

### Presentation & UX
- 💱 **Currency formatting** — EGP amounts via `CurrencyPipe` (`1.2-2`).
- 🧾 **Custom `CategoryIconPipe`** — renders each category as an emoji + label (e.g. `🍔 Food`).
- 🚨 **`HighlightOverBudgetDirective`** — flags expenses exceeding a budget threshold (`100` by default) on the card.
- 🌙 **Dark glassmorphism theme** — deep slate/navy palette, aurora gradient background, frosted-glass cards, neon accent gradients, and CSS custom properties for a fully themed UI.
- 📱 **Responsive** — grid collapses gracefully on smaller screens.

### AI Chatbot
- 💬 Floating chat widget with open/close toggle, auto-scrolling history, and typing indicator.
- 🧠 Sends your message **plus the current expenses** to the n8n webhook; the AI answers grounded in your real data (totals, category breakdowns, trends, saving tips).
- 🪪 Per-browser **session ID** for conversational continuity.
- 🛡️ Graceful fallback reply when the webhook is unreachable.

### Quality
- ✅ **Unit tests** with **Vitest + jsdom** (services, components, pipe, directive).
- ♿ **Accessibility** — labelled controls, ARIA attributes, keyboard-friendly actions.

---

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Angular](https://angular.dev) `^22.1` (standalone, Signals, SSR-ready) |
| Language | TypeScript `~6.0` |
| Reactive state | Angular Signals (`signal`, `computed`, `effect`) |
| Forms | Reactive Forms (`FormBuilder`, custom validators) |
| HTTP | `HttpClient` with `withFetch()` |
| Styling | Plain CSS + CSS custom properties (dark glassmorphism) |
| Mock API | [json-server](https://github.com/typicode/json-server) |
| AI Assistant | [n8n](https://n8n.io) LangChain **AI Agent** + generative chat-LLM — **Google Gemini** (recommended) or any n8n-supported LLM (OpenAI, Anthropic, …) |
| Server-side rendering | `@angular/ssr` + Express |
| Tests | Vitest `^4` + jsdom `^28` |
| Tooling | Angular CLI `^22`, Prettier |

---

## 📁 Project Structure

```
my-angular-project/
├── angular.json                     # Angular CLI workspace config
├── db.json                          # json-server seed data (expenses)
├── n8n-workflow.json                # AI chatbot workflow (webhook → AI Agent → LLM)
├── package.json                     # Dependencies & npm scripts
├── package-lock.json
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html                   # App entry HTML
│   ├── main.ts                      # Standalone bootstrap (bootstrapApplication)
│   ├── main.server.ts               # SSR entry
│   ├── server.ts                    # Express SSR server
│   ├── styles.css                   # Global theme (dark palette, CSS variables, aurora bg)
│   ├── app/
│   │   ├── app.ts                   # Root component (Loads expenses on init)
│   │   ├── app.html                 # Shell: header, dashboard grid, chatbot
│   │   ├── app.css                  # Header / layout styles
│   │   ├── app.config.ts            # App providers (HttpClient, router, hydration)
│   │   ├── app.config.server.ts     # Server-side providers
│   │   ├── app.routes.ts            # Routes
│   │   ├── app.routes.server.ts     # SSR routes
│   │   ├── app.spec.ts              # Root component tests
│   │   ├── components/
│   │   │   ├── chatbot/             # Floating AI chat widget
│   │   │   │   ├── chatbot.ts
│   │   │   │   ├── chatbot.html
│   │   │   │   ├── chatbot.css
│   │   │   │   └── chatbot.spec.ts
│   │   │   ├── expense-form/        # Add/Edit expense form (Reactive Forms)
│   │   │   │   ├── expense-form.ts
│   │   │   │   ├── expense-form.html
│   │   │   │   ├── expense-form.css
│   │   │   │   └── expense-form.spec.ts
│   │   │   └── expense-list/        # Filter/sort/list, running total
│   │   │       ├── expense-list.ts
│   │   │       ├── expense-list.html
│   │   │       ├── expense-list.css
│   │   │       └── expense-list.spec.ts
│   │   ├── directives/
│   │   │   ├── highlight-over-budget.directive.ts
│   │   │   └── highlight-over-budget.directive.spec.ts
│   │   ├── models/
│   │   │   └── expense.model.ts     # Expense / category / chatbot types
│   │   ├── pipes/
│   │   │   ├── category-icon.pipe.ts
│   │   │   └── category-icon.pipe.spec.ts
│   │   └── services/
│   │       ├── expense.service.ts   # Signals-based CRUD store + HTTP calls
│   │       ├── expense.service.spec.ts
│   │       ├── ai-chatbot.service.ts  # Posts messages to the n8n webhook
│   │       └── ai-chatbot.service.spec.ts
│   └── environments/
│       ├── environment.ts           # apiUrl + aiAgentWebhookUrl
│       └── environment.development.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── .editorconfig / .gitignore / .prettierrc
```

> Generated/ignored folders (`node_modules/`, `dist/`, `.angular/`, `.git/`) are omitted.

---

## 📋 Prerequisites

- **Node.js 20+** (LTS recommended) and npm.
- A code editor of your choice (VS Code works great).
- Internet access on first run so `npx` can fetch **json-server** and **n8n**.

Install the Angular dependencies:

```bash
npm install
```

---

## 🏃 Running the Application

The project needs **three local servers**. Run each in its own terminal.

### 1. Start json-server (REST API) — port `3000`

```bash
npx json-server --watch db.json --port 3000
```

- Serves the expense API at `http://localhost:3000/expenses`.
- Auto-persists changes back to `db.json`.
- > 💡 json-server v0.17 (classic) uses `--watch`; on json-server v1 the flag was removed but file watching is on by default — `npx json-server db.json --port 3000` is equivalent.

### 2. Start n8n (AI assistant) — port `5678`

```bash
npx n8n
```

1. First launch opens `http://localhost:5678` — create your n8n admin account.
2. **Import the workflow**: **Workflows → Import from File →** select `n8n-workflow.json`.
3. Open the **chat model** node (e.g. **Google Gemini Chat Model**) and add the matching **API key** credential. The AI backend is fully configurable — any n8n-supported LLM (OpenAI, Anthropic, etc.) can be used instead; the rest of the workflow is unchanged.
4. **Activate** the workflow so its webhook goes live at `http://localhost:5678/webhook/expense-chatbot`.

### 3. Start the Angular dev server — port `4200`

```bash
npm start
```

(Equals `ng serve`; run with `npx ng serve` if you prefer.)

Open **http://localhost:4200/** in your browser. The app auto-loads expenses on startup and everything (add / edit / delete / chat) works end to end.

> ⚙️ All hard-coded endpoints live in `src/environments/environment.ts`:
> ```ts
> export const environment = {
>   production: false,
>   apiUrl: 'http://localhost:3000/expenses',
>   aiAgentWebhookUrl: 'http://localhost:5678/webhook/expense-chatbot',
> };
> ```

---

## 🧪 Testing

Run the unit test suite (Vitest + jsdom) once:

```bash
npx ng test --watch=false
```

Or launch it in watch mode:

```bash
npm test
```

---

## 📦 Building

Create an optimized production build (output in `dist/`):

```bash
npx ng build
```

---

## 🔌 REST API Reference (json-server)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/expenses` | List all expenses |
| `GET` | `/expenses/:id` | Get a single expense |
| `POST` | `/expenses` | Create an expense (id auto-generated) |
| `PUT` | `/expenses/:id` | Replace an expense |
| `PATCH` | `/expenses/:id` | Partially update an expense |
| `DELETE` | `/expenses/:id` | Delete an expense |

**Expense shape:**

```json
{
  "id": "1NSPxX8vTcU",
  "amount": 2000,
  "category": "Other",
  "date": "2026-09-02",
  "note": "skincare (optional)"
}
```

> 💡 ID is a **string** — either a numeric-style string (`"2"`) or an auto-generated one (`"1NSPxX8vTcU"`). The app always treats IDs as strings so CRUD requests stay valid against json-server.

---

## 🧠 Architecture Notes

- **`ExpenseService`** is the single source of truth: it exposes `expenses`, `editingExpense`, `loading`, and `error` as Signals, and wraps all HTTP calls to json-server.
- **`ExpenseListComponent`** derives `filteredExpenses`, `runningTotal`, etc. with `computed()`, so filtering/sorting/totals stay reactive with zero manual change detection.
- **`ExpenseFormComponent`** uses **Reactive Forms** for both create and edit, with custom validation (no future dates, amount > 0, note ≤ 200 chars).
- **`CategoryIconPipe`** keeps presentation mapping (emoji per category) declarative and testable.
- **`HighlightOverBudgetDirective`** highlights cards whose amount exceeds the budget threshold — a reusable, attribute-based behaviour.
- **`ChatbotComponent`** submits `{ message, sessionId, expenses }` to the n8n webhook and renders the AI reply; `AiChatbotService` degrades gracefully if the webhook is down.

---

## 📜 License

This is a learning/demo project. No license is applied unless you add one.