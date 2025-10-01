import React, { useEffect, useRef } from 'react';
import { formatDateShort } from '../utils/format';

/**
 * PUBLIC_INTERFACE
 * NoteEditor - editable view for a selected note.
 * Props:
 * - note: Note
 * - onChange: (patch: Partial<Note>) => void
 * - onDelete: () => void
 * - saving: boolean
 * - refTitle: React.RefObject<HTMLInputElement>
 */
function NoteEditor({ note, onChange, onDelete, saving, refTitle }) {
  const textRef = useRef(null);

  // Auto-resize textarea on content changes
  const autoResize = () => {
    const ta = textRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };

  useEffect(() => {
    autoResize();
  }, [note.content]);

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <input
          ref={refTitle}
          className="editor-title"
          type="text"
          placeholder="Note title"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          aria-label="Note title"
        />
        <div className="editor-actions">
          <button
            className="btn danger"
            onClick={onDelete}
            aria-label={`Delete ${note.title?.trim() || 'untitled'} note`}
            title="Delete note"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="editor-content">
        <textarea
          ref={textRef}
          className="textarea"
          placeholder="Write your note..."
          value={note.content}
          onChange={(e) => {
            onChange({ content: e.target.value });
            // resize optimistically
            autoResize();
          }}
          aria-label="Note content"
        />
        <div className="meta-row" aria-live="polite">
          <span>
            Created {formatDateShort(note.createdAt)} · Last edited {formatDateShort(note.updatedAt)}
          </span>
          <span>{saving ? 'Saving…' : 'Saved'}</span>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
