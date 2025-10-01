import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header component for Ocean Notes.
 * Props:
 * - theme: 'light' | 'dark'
 * - onToggleTheme: () => void
 * - query: string
 * - onQueryChange: (q: string) => void
 * - sortKey: string
 * - onSortChange: (key: string) => void
 */
function Header({ theme, onToggleTheme, query, onQueryChange, sortKey, onSortChange }) {
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <h1 className="header-title">Ocean Notes</h1>

        <label className="visually-hidden" htmlFor="search-notes">Search notes</label>
        <input
          id="search-notes"
          className="input"
          placeholder="Search notes"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search notes by title or content"
        />

        <div className="header-actions" role="group" aria-label="Header actions">
          <label className="visually-hidden" htmlFor="sort-notes">Sort notes</label>
          <select
            id="sort-notes"
            className="select"
            aria-label="Sort notes"
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="updated_desc">Updated (newest)</option>
            <option value="updated_asc">Updated (oldest)</option>
            <option value="created_desc">Created (newest)</option>
            <option value="created_asc">Created (oldest)</option>
            <option value="title">Title (A→Z)</option>
          </select>

          <button
            className="btn ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
