import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Stats, JournalEntry } from '../types';
import { api } from '../utils/api';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, entriesData] = await Promise.all([
        api.getStats(),
        api.getEntries()
      ]);
      setStats(statsData);
      setEntries(entriesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const energyData = entries
    .filter(e => e.energy_level)
    .map(e => ({
      date: format(new Date(e.date), 'MMM dd'),
      energy: e.energy_level
    }))
    .reverse()
    .slice(0, 14);

  const weeklyProgress = entries.reduce((acc, entry) => {
    const week = `Week ${Math.ceil(entries.indexOf(entry) / 7) + 1}`;
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const progressData = Object.entries(weeklyProgress).map(([week, count]) => ({
    week,
    entries: count
  }));

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Current Streak</h3>
          <div className="value">{stats?.current_streak || 0} 🔥</div>
        </div>
        <div className="stat-card">
          <h3>Longest Streak</h3>
          <div className="value">{stats?.longest_streak || 0} 📅</div>
        </div>
        <div className="stat-card">
          <h3>Total Entries</h3>
          <div className="value">{stats?.total_entries || 0} 📝</div>
        </div>
        <div className="stat-card">
          <h3>Avg Energy</h3>
          <div className="value">{stats?.avg_energy_level || 0} ⚡</div>
        </div>
        <div className="stat-card">
          <h3>Total Wins</h3>
          <div className="value">{stats?.total_wins || 0} 🎉</div>
        </div>
        <div className="stat-card">
          <h3>Challenges</h3>
          <div className="value">{stats?.total_challenges || 0} 🎯</div>
        </div>
      </div>

      {energyData.length > 0 && (
        <div className="chart-container">
          <h3>Energy Level Trend (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {progressData.length > 0 && (
        <div className="chart-container">
          <h3>Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entries" fill="#764ba2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h3>Recent Entries</h3>
        <div className="entries-list">
          {entries.slice(0, 5).map(entry => (
            <div key={entry.id} className="entry-item">
              <h3>{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</h3>
              <p><strong>{entry.course_topic}</strong></p>
              <p className="entry-preview">
                {entry.learnings?.substring(0, 150)}
                {entry.learnings && entry.learnings.length > 150 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
