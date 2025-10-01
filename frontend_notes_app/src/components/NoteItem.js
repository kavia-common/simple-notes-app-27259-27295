import React from 'react';
import { formatDateShort } from '../utils/format';

/**
 * PUBLIC_INTERFACE
 * NoteItem - clickable row with actions.
 * Props:
 * - note: Note
 * - selected: boolean
 * - onSelect: () => void
 * - onDelete: () => void
 * - onPinToggle: () => void
 */
function NoteItem({ note, selected, onSelect, onDelete, onPinToggle }) {
  return (
    <div
      className="note-item"
      role="listitem"
      tabIndex={0}
      aria-current={selected ? 'true' : 'false'}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div>
        <h3 className="note-title">
          {note.title?.trim() ? note.title : 'Untitled'}
        </h3>
        <p className="note-meta">
          Updated {formatDateShort(note.updatedAt)}
          {note.pinned ? ' · Pinned' : ''}
        </p>
      </div>
      <div className="note-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn"
          aria-pressed={note.pinned ? 'true' : 'false'}
          aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          title={note.pinned ? 'Unpin note' : 'Pin note'}
          onClick={onPinToggle}
        >
          {note.pinned ? '📌' : '📍'}
        </button>
        <button
          className="icon-btn"
          aria-label={`Delete ${note.title?.trim() || 'untitled'} note`}
          title="Delete note"
          onClick={onDelete}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default NoteItem;
