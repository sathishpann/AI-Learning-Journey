import axios from 'axios';
import { JournalEntry, QuickNote, Stats } from '../types';

const API_BASE = '/api';

export const api = {
  // Journal Entries
  createEntry: async (entry: JournalEntry) => {
    const response = await axios.post(`${API_BASE}/entries`, entry);
    return response.data;
  },

  getEntries: async () => {
    const response = await axios.get<JournalEntry[]>(`${API_BASE}/entries`);
    return response.data;
  },

  getEntryByDate: async (date: string) => {
    const response = await axios.get(`${API_BASE}/entries/by-date/${date}`);
    return response.data;
  },

  // Quick Notes
  createQuickNote: async (note: QuickNote) => {
    const response = await axios.post(`${API_BASE}/quick-notes`, note);
    return response.data;
  },

  getQuickNotes: async (noteType?: string) => {
    const response = await axios.get<QuickNote[]>(`${API_BASE}/quick-notes`, {
      params: noteType ? { note_type: noteType } : {}
    });
    return response.data;
  },

  resolveNote: async (noteId: number) => {
    const response = await axios.patch(`${API_BASE}/quick-notes/${noteId}/resolve`);
    return response.data;
  },

  // Stats
  getStats: async () => {
    const response = await axios.get<Stats>(`${API_BASE}/stats`);
    return response.data;
  },

  // Search
  searchEntries: async (query: string) => {
    const response = await axios.get<JournalEntry[]>(`${API_BASE}/search`, {
      params: { q: query }
    });
    return response.data;
  }
};
