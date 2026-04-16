import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { api } from '../utils/api';
import { format } from 'date-fns';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JournalEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await api.searchEntries(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightText = (text: string | undefined, query: string) => {
    if (!text) return '';
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="card">
      <h2>Search Your Journey</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search learnings, topics, challenges..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isSearching && (
        <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          Searching...
        </p>
      )}

      {!isSearching && query && results.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No results found for "{query}"
        </p>
      )}

      {results.length > 0 && (
        <div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          <div className="entries-list">
            {results.map(entry => (
              <div key={entry.id} className="entry-item">
                <h3>{format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}</h3>
                {entry.course_topic && (
                  <p>
                    <strong>Topic:</strong>{' '}
                    <span dangerouslySetInnerHTML={{ __html: highlightText(entry.course_topic, query) }} />
                  </p>
                )}
                {entry.learnings && (
                  <div>
                    <strong>Learnings:</strong>
                    <p
                      className="entry-preview"
                      dangerouslySetInnerHTML={{ __html: highlightText(entry.learnings.substring(0, 200), query) }}
                    />
                  </div>
                )}
                {entry.aha_moment && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Aha Moment:</strong>
                    <p
                      className="entry-preview"
                      dangerouslySetInnerHTML={{ __html: highlightText(entry.aha_moment, query) }}
                    />
                  </div>
                )}
                {entry.challenges && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Challenges:</strong>
                    <p
                      className="entry-preview"
                      dangerouslySetInnerHTML={{ __html: highlightText(entry.challenges, query) }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
