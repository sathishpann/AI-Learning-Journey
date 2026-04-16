import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DailyEntry } from './components/DailyEntry';
import { QuickNotes } from './components/QuickNotes';
import { Search } from './components/Search';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'notes' | 'search'>('dashboard');

  return (
    <div className="app">
      <div className="header">
        <h1>🚀 AI Learning Journey Tracker</h1>
        <p>Track your progress, celebrate wins, and learn smarter</p>
        <div className="nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === 'entry' ? 'active' : ''}
            onClick={() => setActiveTab('entry')}
          >
            📝 Daily Entry
          </button>
          <button
            className={activeTab === 'notes' ? 'active' : ''}
            onClick={() => setActiveTab('notes')}
          >
            ⚡ Quick Notes
          </button>
          <button
            className={activeTab === 'search' ? 'active' : ''}
            onClick={() => setActiveTab('search')}
          >
            🔍 Search
          </button>
        </div>
      </div>

      <div className="content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'entry' && <DailyEntry />}
        {activeTab === 'notes' && <QuickNotes />}
        {activeTab === 'search' && <Search />}
      </div>
    </div>
  );
}

export default App;
