import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEY, storage } from './utils/storage';
import { formatDateShort } from './utils/format';

// Data model: { id, title, content, createdAt, updatedAt, pinned, color }

// PUBLIC_INTERFACE
function App() {
  /** Theme persisted via localStorage and applied to document */
  const [theme, setTheme] = useLocalStorage('ocean-notes:theme', 'light');

  /** Notes state persisted via localStorage under ocean-notes:v1 */
  const [notes, setNotes] = useLocalStorage(STORAGE_KEY, []);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('updated_desc'); // updated_desc|updated_asc|created_desc|created_asc|title
  const [saving, setSaving] = useState(false);

  const editorTitleRef = useRef(null);
  const fabRef = useRef(null);

  // Seed an example note if none exist
  useEffect(() => {
    if (!Array.isArray(notes) || notes.length === 0) {
      const example = storage.createNote({
        title: 'Welcome to Ocean Notes',
        content:
          'This is your first note. Use the + button to create new notes.\n\n- Search and sort your notes\n- Pin important notes to the top\n- Autosave with debounce ensures performance\n\nEnjoy!',
        color: 'default',
        pinned: true,
      });
      setNotes([example]);
      setSelectedId(example.id);
    }
  }, [notes, setNotes]);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // Derived selections
  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Search + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = notes;
    if (q) {
      list = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    const by = {
      updated_desc: (a, b) => b.updatedAt - a.updatedAt,
      updated_asc: (a, b) => a.updatedAt - b.updatedAt,
      created_desc: (a, b) => b.createdAt - a.createdAt,
      created_asc: (a, b) => a.createdAt - b.createdAt,
      title: (a, b) => a.title.localeCompare(b.title),
    }[sortKey];
    const sorted = [...list].sort(by);

    const pinned = sorted.filter((n) => n.pinned);
    const others = sorted.filter((n) => !n.pinned);
    return { pinned, others };
  }, [notes, query, sortKey]);

  // Create new note and focus editor
  const createNewNote = useCallback(() => {
    const newNote = storage.createNote({});
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);

    // Focus editor title shortly after render
    setTimeout(() => {
      if (editorTitleRef.current) editorTitleRef.current.focus();
    }, 0);
  }, [setNotes]);

  const deleteNote = useCallback(
    (id) => {
      const note = notes.find((n) => n.id === id);
      const title = note?.title?.trim() || 'Untitled note';
      const ok = window.confirm(`Delete "${title}"? This cannot be undone.`);
      if (!ok) return;
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    },
    [notes, selectedId, setNotes]
  );

  const togglePin = useCallback(
    (id) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
        )
      );
    },
    [setNotes]
  );

  // Debounced save for editor changes
  const saveTimer = useRef(null);
  const onEditChange = useCallback(
    (patch) => {
      if (!selectedNote) return;
      setSaving(true);
      // Update immediately in state for responsive UI
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedNote.id
            ? { ...n, ...patch, updatedAt: Date.now() }
            : n
        )
      );
      // Debounce persistence
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
      saveTimer.current = setTimeout(() => {
        setSaving(false);
      }, 500);
    },
    [selectedNote, setNotes]
  );

  // Keyboard: new note with Ctrl/Cmd+N
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewNote();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createNewNote]);

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        query={query}
        onQueryChange={setQuery}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <main className="main-layout" role="main" aria-label="Notes workspace">
        <aside className="sidebar" aria-label="Notes list">
          {filtered.pinned.length > 0 && (
            <section aria-labelledby="pinned-notes-title">
              <h2 id="pinned-notes-title" className="section-title">
                Pinned
              </h2>
              <NotesList
                notes={filtered.pinned}
                onSelect={setSelectedId}
                selectedId={selectedId}
                onDelete={deleteNote}
                onPinToggle={togglePin}
              />
            </section>
          )}

          <section aria-labelledby="other-notes-title">
            <h2 id="other-notes-title" className="section-title">
              Notes
            </h2>
            <NotesList
              notes={filtered.others}
              onSelect={setSelectedId}
              selectedId={selectedId}
              onDelete={deleteNote}
              onPinToggle={togglePin}
            />
          </section>
        </aside>

        <section className="editor-panel" aria-label="Note editor">
          {selectedNote ? (
            <NoteEditor
              refTitle={editorTitleRef}
              note={selectedNote}
              onChange={onEditChange}
              onDelete={() => deleteNote(selectedNote.id)}
              saving={saving}
            />
          ) : (
            <div className="empty-editor" role="note" aria-live="polite">
              <h3>No note selected</h3>
              <p>Select a note from the left, or create a new one.</p>
              <button
                className="btn primary"
                onClick={createNewNote}
                aria-label="Create a new note"
              >
                + New note
              </button>
            </div>
          )}
        </section>
      </main>

      <button
        ref={fabRef}
        className="fab"
        aria-label="Create new note"
        title="Create new note (Ctrl/Cmd+N)"
        onClick={createNewNote}
      >
        +
      </button>

      <footer className="footer-meta" aria-live="polite">
        <span>
          {selectedNote
            ? `Last edited ${formatDateShort(selectedNote.updatedAt)}`
            : 'Ocean Professional · Notes'}
        </span>
        <span aria-live="polite" className="save-indicator">
          {saving ? 'Saving…' : 'Saved'}
        </span>
      </footer>
    </div>
  );
}

export default App;
