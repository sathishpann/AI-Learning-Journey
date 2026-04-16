# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                     http://localhost:3000                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Port 3000)                       │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    React Application                       │ │
│  │  - Written in: TypeScript                                 │ │
│  │  - Build Tool: Vite                                       │ │
│  │  - UI Framework: React 18                                 │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  Components:                                              │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │ │
│  │  │ Dashboard   │  │ DailyEntry   │  │  QuickNotes    │  │ │
│  │  │ (Recharts)  │  │ (Auto-save)  │  │  (Modal UI)    │  │ │
│  │  └─────────────┘  └──────────────┘  └────────────────┘  │ │
│  │  ┌─────────────┐                                         │ │
│  │  │  Search     │                                         │ │
│  │  │ (Highlight) │                                         │ │
│  │  └─────────────┘                                         │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  State Management: React Hooks (useState, useEffect)     │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  HTTP Client: Axios                                      │ │
│  │  - Makes API calls to backend                            │ │
│  │  - Handles responses/errors                              │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  Utils:                                                   │ │
│  │  - api.ts (API wrapper functions)                        │ │
│  │  - date-fns (Date formatting)                            │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls (/api/*)
                             │ JSON over HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VITE DEV SERVER (Proxy)                       │
│  - Proxies /api/* requests to backend                          │
│  - Handles CORS in development                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Port 8000)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   FastAPI Application                      │ │
│  │  - Written in: Python 3                                   │ │
│  │  - Web Framework: FastAPI                                 │ │
│  │  - Server: Uvicorn (ASGI)                                 │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  API Endpoints (main.py):                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ POST   /api/entries          Create/Update Entry   │ │ │
│  │  │ GET    /api/entries          List All Entries      │ │ │
│  │  │ GET    /api/entries/{id}     Get Single Entry      │ │ │
│  │  │ GET    /api/entries/by-date  Get by Date          │ │ │
│  │  │ POST   /api/quick-notes      Add Quick Note        │ │ │
│  │  │ GET    /api/quick-notes      List Notes            │ │ │
│  │  │ PATCH  /api/quick-notes/{id} Mark Resolved         │ │ │
│  │  │ GET    /api/stats            Get Statistics        │ │ │
│  │  │ GET    /api/search           Search Entries        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  Data Validation: Pydantic Models                        │ │
│  │  - JournalEntryCreate                                    │ │
│  │  - QuickNoteCreate                                       │ │
│  │  - Response models with type checking                    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  ORM Layer: SQLAlchemy (database.py)                     │ │
│  │  - Maps Python objects to database tables                │ │
│  │  - Handles relationships & queries                       │ │
│  └───────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┬┴───────────────────────────────────┘
                             │
                             │ SQL Queries
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                            │
│                  learning_journal.db                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Tables:                                                   │ │
│  │  ┌─────────────────────┐                                  │ │
│  │  │ journal_entries     │                                  │ │
│  │  ├─────────────────────┤                                  │ │
│  │  │ id (PK)            │                                  │ │
│  │  │ date               │                                  │ │
│  │  │ course_topic       │                                  │ │
│  │  │ learnings          │                                  │ │
│  │  │ aha_moment         │                                  │ │
│  │  │ challenges         │                                  │ │
│  │  │ wins               │                                  │ │
│  │  │ work_application   │                                  │ │
│  │  │ energy_level       │                                  │ │
│  │  │ tomorrow_goal      │                                  │ │
│  │  │ created_at         │                                  │ │
│  │  │ updated_at         │                                  │ │
│  │  └─────────────────────┘                                  │ │
│  │                                                            │ │
│  │  ┌─────────────────────┐                                  │ │
│  │  │ quick_notes         │                                  │ │
│  │  ├─────────────────────┤                                  │ │
│  │  │ id (PK)            │                                  │ │
│  │  │ note_type          │ (win/challenge/idea/question)   │ │
│  │  │ content            │                                  │ │
│  │  │ tags               │                                  │ │
│  │  │ is_resolved        │                                  │ │
│  │  │ created_at         │                                  │ │
│  │  └─────────────────────┘                                  │ │
│  │                                                            │ │
│  │  ┌─────────────────────┐                                  │ │
│  │  │ weekly_reflections  │                                  │ │
│  │  ├─────────────────────┤                                  │ │
│  │  │ id (PK)            │                                  │ │
│  │  │ week_number        │                                  │ │
│  │  │ week_start         │                                  │ │
│  │  │ learnings          │                                  │ │
│  │  │ energy_level       │                                  │ │
│  │  │ motivation_level   │                                  │ │
│  │  │ ...                │                                  │ │
│  │  └─────────────────────┘                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Examples

### 1. User Saves a Daily Entry (Auto-save)

```
User Types in Form
       │
       ▼
React onChange Event Fires
       │
       ▼
Debounce Timer (1 second)
       │
       ▼
api.createEntry() called
       │
       ▼
Axios POST /api/entries
       │ (Sends JSON)
       │ {
       │   date: "2026-04-16T00:00:00Z",
       │   course_topic: "AI Fundamentals",
       │   learnings: "Learned about neural networks..."
       │ }
       ▼
FastAPI receives request
       │
       ▼
Pydantic validates data
       │
       ▼
SQLAlchemy ORM
       │
       ▼
SQL: INSERT or UPDATE journal_entries
       │
       ▼
SQLite writes to disk
       │
       ▼
FastAPI returns JSON response
       │
       ▼
React updates UI
       │
       ▼
"Saved ✓" indicator shows
```

### 2. Dashboard Loads Statistics

```
User Clicks "Dashboard"
       │
       ▼
React useEffect() hook
       │
       ▼
api.getStats() + api.getEntries()
       │
       ▼
Parallel HTTP GET requests
       │
       ├─▶ GET /api/stats
       │        │
       │        ▼
       │   FastAPI queries all entries
       │        │
       │        ▼
       │   Calculates:
       │   - Current streak
       │   - Longest streak
       │   - Average energy
       │        │
       │        ▼
       │   Returns JSON
       │
       └─▶ GET /api/entries
                │
                ▼
           SQLAlchemy query
                │
                ▼
           SQL: SELECT * FROM journal_entries
                │
                ▼
           Returns JSON array
       │
       ▼
React receives both responses
       │
       ▼
Recharts renders visualizations
       │
       ▼
Stats cards display numbers
```

### 3. Search Flow

```
User Types in Search Box
       │
       ▼
api.searchEntries("prompt engineering")
       │
       ▼
GET /api/search?q=prompt+engineering
       │
       ▼
FastAPI receives query
       │
       ▼
SQLAlchemy filters:
  WHERE learnings LIKE '%prompt engineering%'
     OR course_topic LIKE '%prompt engineering%'
     OR aha_moment LIKE '%prompt engineering%'
       │
       ▼
SQL: SELECT with WHERE clauses
       │
       ▼
Returns matching entries
       │
       ▼
React highlights matches
       │
       ▼
Search results displayed
```

## Technology Stack Details

### Frontend Stack
```
TypeScript (Language)
    ↓
React (UI Framework)
    ↓
Components (Dashboard, DailyEntry, etc.)
    ↓
Recharts (Charts)
date-fns (Date utils)
Axios (HTTP client)
    ↓
Vite (Dev server + bundler)
    ↓
Browser
```

### Backend Stack
```
Python 3 (Language)
    ↓
FastAPI (Web framework)
    ↓
Pydantic (Data validation)
    ↓
SQLAlchemy (ORM)
    ↓
SQLite (Database)
    ↓
Uvicorn (ASGI server)
```

## Key Design Patterns

### 1. **RESTful API**
- Standard HTTP methods (GET, POST, PATCH)
- Resource-based URLs (/api/entries, /api/stats)
- JSON for data exchange

### 2. **Single Page Application (SPA)**
- No page refreshes
- Client-side routing with tabs
- Dynamic content updates

### 3. **Separation of Concerns**
```
Presentation Layer (React)      → User Interface
Business Logic (FastAPI)        → API endpoints, validation
Data Layer (SQLAlchemy)         → Database operations
Storage (SQLite)                → Persistent data
```

### 4. **Component-Based Architecture**
- Reusable UI components
- Each component manages its own state
- Props for parent-child communication

### 5. **ORM Pattern**
```python
# Instead of raw SQL:
# cursor.execute("INSERT INTO journal_entries VALUES (...)")

# You write Python objects:
entry = JournalEntry(
    date=datetime.now(),
    learnings="Today I learned..."
)
db.add(entry)
db.commit()
```

## Communication Protocol

### Request/Response Cycle
```
Frontend                        Backend
   │                              │
   │ POST /api/entries            │
   ├─────────────────────────────▶│
   │ Headers:                     │
   │   Content-Type: application/json
   │ Body:                        │
   │   { "date": "...", ... }     │
   │                              │
   │                              ├─▶ Validate data
   │                              ├─▶ Save to DB
   │                              │
   │          200 OK              │
   │◀─────────────────────────────┤
   │ Headers:                     │
   │   Content-Type: application/json
   │ Body:                        │
   │   { "id": 1, "date": ... }   │
   │                              │
```

## Why This Architecture?

### ✅ Scalability
- Frontend and backend can scale independently
- Can add Redis caching layer later
- Can migrate to PostgreSQL for multi-user

### ✅ Maintainability
- Clear separation of concerns
- TypeScript catches frontend errors
- Python type hints catch backend errors

### ✅ Extensibility
- Easy to add new API endpoints
- Easy to add new React components
- Can add authentication layer
- Can add AI features (sentiment analysis, insights)

### ✅ Developer Experience
- Hot reload in development (instant feedback)
- Auto-generated API docs at /docs
- Type checking prevents bugs

### ✅ User Experience
- Fast, responsive UI
- Auto-save (no lost work)
- Real-time updates
- Smooth animations

## Future Enhancement Possibilities

1. **Add Authentication**
   - JWT tokens
   - Multi-user support
   - Cloud sync

2. **Add AI Features** (Python ML libraries)
   - Sentiment analysis on entries
   - Learning pattern recognition
   - Automated insights

3. **Mobile App**
   - React Native (reuse components)
   - Same backend API

4. **Real-time Features**
   - WebSocket for live updates
   - Collaborative learning with friends

5. **Export/Import**
   - PDF reports
   - Markdown export
   - Import from your old markdown files
