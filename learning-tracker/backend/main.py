from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel
from database import get_db, JournalEntry, WeeklyReflection, QuickNote

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class JournalEntryCreate(BaseModel):
    date: datetime
    course_topic: Optional[str] = None
    learnings: Optional[str] = None
    aha_moment: Optional[str] = None
    challenges: Optional[str] = None
    wins: Optional[str] = None
    work_application: Optional[str] = None
    energy_level: Optional[int] = None
    tomorrow_goal: Optional[str] = None

class JournalEntryResponse(JournalEntryCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QuickNoteCreate(BaseModel):
    note_type: str
    content: str
    tags: Optional[str] = None

class QuickNoteResponse(QuickNoteCreate):
    id: int
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True

class WeeklyReflectionCreate(BaseModel):
    week_number: int
    week_start: datetime
    learnings: str
    surprises: Optional[str] = None
    harder_than_expected: Optional[str] = None
    easier_than_expected: Optional[str] = None
    energy_level: Optional[int] = None
    motivation_level: Optional[int] = None
    on_track: Optional[str] = None
    adjustments: Optional[str] = None

class StatsResponse(BaseModel):
    total_entries: int
    current_streak: int
    longest_streak: int
    avg_energy_level: float
    total_wins: int
    total_challenges: int
    days_active: int

# Journal Entry endpoints
@app.post("/api/entries", response_model=JournalEntryResponse)
def create_entry(entry: JournalEntryCreate, db: Session = Depends(get_db)):
    db_entry = db.query(JournalEntry).filter(
        JournalEntry.date == entry.date.replace(hour=0, minute=0, second=0, microsecond=0)
    ).first()

    if db_entry:
        for key, value in entry.dict(exclude_unset=True).items():
            setattr(db_entry, key, value)
        db_entry.updated_at = datetime.utcnow()
    else:
        db_entry = JournalEntry(**entry.dict())
        db.add(db_entry)

    db.commit()
    db.refresh(db_entry)
    return db_entry

@app.get("/api/entries", response_model=List[JournalEntryResponse])
def get_entries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).order_by(JournalEntry.date.desc()).offset(skip).limit(limit).all()
    return entries

@app.get("/api/entries/{entry_id}", response_model=JournalEntryResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@app.get("/api/entries/by-date/{date}")
def get_entry_by_date(date: str, db: Session = Depends(get_db)):
    entry_date = datetime.fromisoformat(date.replace('Z', '+00:00')).replace(hour=0, minute=0, second=0, microsecond=0)
    entry = db.query(JournalEntry).filter(JournalEntry.date == entry_date).first()
    if not entry:
        return None
    return entry

# Quick Notes endpoints
@app.post("/api/quick-notes", response_model=QuickNoteResponse)
def create_quick_note(note: QuickNoteCreate, db: Session = Depends(get_db)):
    db_note = QuickNote(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/api/quick-notes", response_model=List[QuickNoteResponse])
def get_quick_notes(note_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(QuickNote)
    if note_type:
        query = query.filter(QuickNote.note_type == note_type)
    notes = query.order_by(QuickNote.created_at.desc()).all()
    return notes

@app.patch("/api/quick-notes/{note_id}/resolve")
def resolve_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(QuickNote).filter(QuickNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.is_resolved = True
    db.commit()
    return {"status": "resolved"}

# Stats endpoint
@app.get("/api/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).order_by(JournalEntry.date).all()

    total_entries = len(entries)

    # Calculate streaks
    current_streak = 0
    longest_streak = 0
    temp_streak = 0

    if entries:
        dates = [entry.date.date() for entry in entries]
        today = datetime.now().date()

        # Current streak
        for i in range((today - dates[0]).days + 1):
            check_date = today - timedelta(days=i)
            if check_date in dates:
                current_streak += 1
            else:
                break

        # Longest streak
        sorted_dates = sorted(dates)
        temp_streak = 1
        for i in range(1, len(sorted_dates)):
            if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                temp_streak += 1
                longest_streak = max(longest_streak, temp_streak)
            else:
                temp_streak = 1
        longest_streak = max(longest_streak, temp_streak)

    # Average energy level
    energy_entries = [e.energy_level for e in entries if e.energy_level]
    avg_energy = sum(energy_entries) / len(energy_entries) if energy_entries else 0

    # Count wins and challenges
    total_wins = db.query(QuickNote).filter(QuickNote.note_type == "win").count()
    total_challenges = db.query(QuickNote).filter(QuickNote.note_type == "challenge").count()

    return {
        "total_entries": total_entries,
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "avg_energy_level": round(avg_energy, 1),
        "total_wins": total_wins,
        "total_challenges": total_challenges,
        "days_active": total_entries
    }

# Search endpoint
@app.get("/api/search")
def search_entries(q: str, db: Session = Depends(get_db)):
    entries = db.query(JournalEntry).filter(
        (JournalEntry.learnings.contains(q)) |
        (JournalEntry.course_topic.contains(q)) |
        (JournalEntry.aha_moment.contains(q)) |
        (JournalEntry.challenges.contains(q))
    ).all()
    return entries

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
