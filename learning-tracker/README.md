# 🚀 AI Learning Journey Tracker

An interactive web application to track your AI learning journey with auto-save, progress visualization, and quick notes.

## Features

- **📝 Daily Journal Entries** - Auto-saving forms for daily reflections
- **📊 Progress Dashboard** - Visual charts showing streaks, energy levels, and weekly progress
- **⚡ Quick Notes** - Fast capture for wins, challenges, ideas, and questions
- **🔍 Smart Search** - Full-text search across all your entries
- **🔥 Streak Tracking** - Gamified progress with current and longest streaks
- **📈 Analytics** - Energy level trends and weekly progress charts

## Setup Instructions

### Backend (Python FastAPI)

1. Navigate to the backend directory:
```bash
cd learning-tracker/backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend (React + TypeScript)

1. Navigate to the frontend directory:
```bash
cd learning-tracker/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. **Dashboard** - View your progress stats, streaks, and charts
2. **Daily Entry** - Fill out your daily learning journal (auto-saves as you type)
3. **Quick Notes** - Quickly add wins, challenges, ideas, or questions
4. **Search** - Find past learnings by keyword

## Tech Stack

### Backend
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite (Database)

### Frontend
- React 18
- TypeScript
- Vite (Build tool)
- Recharts (Charts)
- date-fns (Date handling)

## Database Schema

- **journal_entries** - Daily journal entries with learnings, aha moments, challenges, etc.
- **quick_notes** - Fast captures for wins, challenges, ideas, questions
- **weekly_reflections** - Weekly reflection summaries

## API Endpoints

- `POST /api/entries` - Create/update journal entry
- `GET /api/entries` - Get all entries
- `GET /api/entries/by-date/{date}` - Get entry by date
- `POST /api/quick-notes` - Add quick note
- `GET /api/quick-notes` - Get all notes (filterable)
- `GET /api/stats` - Get progress statistics
- `GET /api/search?q=query` - Search entries

## Features in Detail

### Auto-Save
All forms auto-save 1 second after you stop typing. No need to click save!

### Streak Tracking
- Current streak: Days in a row with entries (from today backward)
- Longest streak: Your personal best consecutive days

### Energy Tracking
Rate your energy level each day (1-5) and see trends over time.

### Quick Add
Fast buttons to capture wins, challenges, ideas, and questions without filling out the full form.

## Future Enhancements

- Weekly/Monthly reflection forms
- Export data to PDF/Markdown
- Import from existing markdown files
- Mobile app version
- Notification reminders
- Tags and categories
- Goal setting and tracking
