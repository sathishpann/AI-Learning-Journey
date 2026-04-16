import React, { useState, useEffect } from 'react';
import { QuickNote } from '../types';
import { api } from '../utils/api';
import { format } from 'date-fns';

export const QuickNotes: React.FC = () => {
  const [notes, setNotes] = useState<QuickNote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newNote, setNewNote] = useState<QuickNote>({
    note_type: 'win',
    content: '',
    tags: ''
  });
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNotes();
  }, [filter]);

  const loadNotes = async () => {
    try {
      const data = await api.getQuickNotes(filter === 'all' ? undefined : filter);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.content.trim()) return;

    try {
      await api.createQuickNote(newNote);
      setNewNote({ note_type: 'win', content: '', tags: '' });
      setShowModal(false);
      loadNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleResolve = async (noteId: number) => {
    try {
      await api.resolveNote(noteId);
      loadNotes();
    } catch (error) {
      console.error('Error resolving note:', error);
    }
  };

  const noteTypeLabels = {
    win: '🎉 Win',
    challenge: '🎯 Challenge',
    idea: '💡 Idea',
    question: '❓ Question'
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '20px' }}>
        <h2>Quick Add</h2>
        <div className="quick-add-grid">
          <button
            className="quick-add-btn"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'win' });
              setShowModal(true);
            }}
          >
            🎉 Add Win
          </button>
          <button
            className="quick-add-btn"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'challenge' });
              setShowModal(true);
            }}
          >
            🎯 Add Challenge
          </button>
          <button
            className="quick-add-btn"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'idea' });
              setShowModal(true);
            }}
          >
            💡 Add Idea
          </button>
          <button
            className="quick-add-btn"
            onClick={() => {
              setNewNote({ ...newNote, note_type: 'question' });
              setShowModal(true);
            }}
          >
            ❓ Add Question
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>My Notes</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="all">All Notes</option>
            <option value="win">Wins</option>
            <option value="challenge">Challenges</option>
            <option value="idea">Ideas</option>
            <option value="question">Questions</option>
          </select>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No notes yet. Start by adding your first win, challenge, idea, or question!
            </p>
          ) : (
            notes.map(note => (
              <div key={note.id} className={`note-item ${note.note_type}`}>
                <div className="note-header">
                  <span className="note-type">{noteTypeLabels[note.note_type]}</span>
                  <span className="note-date">
                    {note.created_at && format(new Date(note.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="note-content">{note.content}</div>
                {note.tags && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#667eea' }}>
                    Tags: {note.tags}
                  </div>
                )}
                {!note.is_resolved && note.note_type === 'challenge' && (
                  <button
                    onClick={() => note.id && handleResolve(note.id)}
                    className="btn btn-primary"
                    style={{ marginTop: '10px', fontSize: '12px', padding: '5px 10px' }}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add {noteTypeLabels[newNote.note_type]}</h2>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                placeholder="What's on your mind?"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Tags (optional)</label>
              <input
                type="text"
                value={newNote.tags || ''}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                placeholder="e.g., python, api, debugging"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddNote}>
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
