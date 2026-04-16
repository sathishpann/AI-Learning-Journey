import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { api } from '../utils/api';

export const DailyEntry: React.FC = () => {
  const [entry, setEntry] = useState<JournalEntry>({
    date: new Date().toISOString(),
    course_topic: '',
    learnings: '',
    aha_moment: '',
    challenges: '',
    wins: '',
    work_application: '',
    energy_level: undefined,
    tomorrow_goal: ''
  });

  const [saveStatus, setSaveStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    loadEntry(selectedDate);
  }, [selectedDate]);

  const loadEntry = async (date: string) => {
    try {
      const existingEntry = await api.getEntryByDate(date);
      if (existingEntry) {
        setEntry(existingEntry);
      } else {
        setEntry({
          date: new Date(date).toISOString(),
          course_topic: '',
          learnings: '',
          aha_moment: '',
          challenges: '',
          wins: '',
          work_application: '',
          energy_level: undefined,
          tomorrow_goal: ''
        });
      }
    } catch (error) {
      console.error('Error loading entry:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEntry(prev => ({ ...prev, [name]: value }));
    autoSave({ ...entry, [name]: value });
  };

  const handleEnergyChange = (level: number) => {
    setEntry(prev => ({ ...prev, energy_level: level }));
    autoSave({ ...entry, energy_level: level });
  };

  let autoSaveTimer: NodeJS.Timeout;
  const autoSave = async (updatedEntry: JournalEntry) => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      try {
        await api.createEntry(updatedEntry);
        setSaveStatus('Saved ✓');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error saving entry:', error);
        setSaveStatus('Error saving');
      }
    }, 1000);
  };

  const energyEmojis = ['😞', '😕', '😐', '😊', '😃'];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Daily Journal Entry</h2>
        <div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          />
          {saveStatus && <span style={{ marginLeft: '10px', color: '#10b981' }}>{saveStatus}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Course/Topic</label>
        <input
          type="text"
          name="course_topic"
          value={entry.course_topic || ''}
          onChange={handleChange}
          placeholder="What are you learning today?"
        />
      </div>

      <div className="form-group">
        <label>Today I Learned</label>
        <textarea
          name="learnings"
          value={entry.learnings || ''}
          onChange={handleChange}
          placeholder="Key learnings from today..."
        />
      </div>

      <div className="form-group">
        <label>Aha Moment 💡</label>
        <textarea
          name="aha_moment"
          value={entry.aha_moment || ''}
          onChange={handleChange}
          placeholder="What clicked for you today?"
        />
      </div>

      <div className="form-group">
        <label>Challenges Faced</label>
        <textarea
          name="challenges"
          value={entry.challenges || ''}
          onChange={handleChange}
          placeholder="What was difficult?"
        />
      </div>

      <div className="form-group">
        <label>Wins to Celebrate 🎉</label>
        <textarea
          name="wins"
          value={entry.wins || ''}
          onChange={handleChange}
          placeholder="What went well?"
        />
      </div>

      <div className="form-group">
        <label>How This Applies to My Work</label>
        <textarea
          name="work_application"
          value={entry.work_application || ''}
          onChange={handleChange}
          placeholder="Real-world applications..."
        />
      </div>

      <div className="form-group">
        <label>Energy Level</label>
        <div className="energy-selector">
          {energyEmojis.map((emoji, index) => (
            <button
              key={index}
              className={`energy-btn ${entry.energy_level === index + 1 ? 'selected' : ''}`}
              onClick={() => handleEnergyChange(index + 1)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Tomorrow's Goal</label>
        <textarea
          name="tomorrow_goal"
          value={entry.tomorrow_goal || ''}
          onChange={handleChange}
          placeholder="What do you want to accomplish tomorrow?"
        />
      </div>
    </div>
  );
};
