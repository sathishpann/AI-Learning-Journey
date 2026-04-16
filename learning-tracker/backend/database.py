from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./learning_journal.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, unique=True, index=True)
    course_topic = Column(String, nullable=True)
    learnings = Column(Text, nullable=True)
    aha_moment = Column(Text, nullable=True)
    challenges = Column(Text, nullable=True)
    wins = Column(Text, nullable=True)
    work_application = Column(Text, nullable=True)
    energy_level = Column(Integer, nullable=True)
    tomorrow_goal = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class WeeklyReflection(Base):
    __tablename__ = "weekly_reflections"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, index=True)
    week_start = Column(DateTime)
    learnings = Column(Text)
    surprises = Column(Text, nullable=True)
    harder_than_expected = Column(Text, nullable=True)
    easier_than_expected = Column(Text, nullable=True)
    energy_level = Column(Integer, nullable=True)
    motivation_level = Column(Integer, nullable=True)
    on_track = Column(String, nullable=True)
    adjustments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuickNote(Base):
    __tablename__ = "quick_notes"

    id = Column(Integer, primary_key=True, index=True)
    note_type = Column(String, index=True)  # 'win', 'challenge', 'idea', 'question'
    content = Column(Text)
    tags = Column(String, nullable=True)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
