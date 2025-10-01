import React from 'react';
import NoteItem from './NoteItem';

/**
 * PUBLIC_INTERFACE
 * NotesList renders a list of notes with selection and actions.
 * Props:
 * - notes: Note[]
 * - selectedId: string|null
 * - onSelect: (id: string) => void
 * - onDelete: (id: string) => void
 * - onPinToggle: (id: string) => void
 */
function NotesList({ notes, selectedId, onSelect, onDelete, onPinToggle }) {
  if (!notes || notes.length === 0) {
    return <p className="note-meta" role="note">No notes</p>;
  }
  return (
    <div role="list" aria-label="Notes">
      {notes.map((n) => (
        <NoteItem
          key={n.id}
          note={n}
          selected={n.id === selectedId}
          onSelect={() => onSelect(n.id)}
          onDelete={() => onDelete(n.id)}
          onPinToggle={() => onPinToggle(n.id)}
        />
      ))}
    </div>
  );
}

export default NotesList;
