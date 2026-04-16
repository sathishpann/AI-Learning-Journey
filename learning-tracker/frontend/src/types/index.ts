export interface JournalEntry {
  id?: number;
  date: string;
  course_topic?: string;
  learnings?: string;
  aha_moment?: string;
  challenges?: string;
  wins?: string;
  work_application?: string;
  energy_level?: number;
  tomorrow_goal?: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuickNote {
  id?: number;
  note_type: 'win' | 'challenge' | 'idea' | 'question';
  content: string;
  tags?: string;
  is_resolved?: boolean;
  created_at?: string;
}

export interface Stats {
  total_entries: number;
  current_streak: number;
  longest_streak: number;
  avg_energy_level: number;
  total_wins: number;
  total_challenges: number;
  days_active: number;
}
