# Ocean Notes (React) — Ocean Professional

A lightweight notes app built with React and vanilla CSS, featuring a modern two‑pane layout, localStorage persistence, and the Ocean Professional theme.

## Features

- Two‑pane responsive layout: notes list + editor (collapses on small screens)
- Floating Action Button (+) to create a new note and focus the editor
- Search (title/content) and sorting:
  - Updated (desc/asc), Created (desc/asc), Title (A→Z)
- Pinned notes section displayed above others
- Editor with title input and auto‑resizing textarea
- Debounced autosave with visible status (Saving… / Saved)
- Delete with confirmation from list or editor
- Keyboard and ARIA accessibility with visible focus styles
- Theme toggle (light/dark); theme persisted to localStorage
- Ocean Professional theme with variables, subtle gradients, and soft shadows
- Data model: `{ id, title, content, createdAt, updatedAt, pinned, color }`
- Persistence key: `ocean-notes:v1`
- Example note is seeded on first load

## Getting Started

From this directory:

- `npm start` — run locally at http://localhost:3000
- `npm test` — run tests
- `npm run build` — production build

No extra dependencies beyond React.

## Theming

Theme variables are defined in `src/App.css` and applied to `:root` with `[data-theme="dark"]` overrides. Toggle theme from the header; the current theme is saved to `localStorage` under `ocean-notes:theme`.

Key colors:
- Primary: #2563EB
- Secondary/Success: #F59E0B
- Error: #EF4444
- Background: #f9fafb (light) / #0b1220 (dark)
- Surface: #ffffff (light) / #0f172a (dark)
- Text: #111827 (light) / #e5e7eb (dark)

## Data Persistence

Notes are stored in `localStorage` under key: `ocean-notes:v1`. On first load, an example pinned note is created. All edits autosave with debounce to avoid excessive writes while typing.

## Project Structure

- `src/App.js` — App shell, state management, layout, FAB
- `src/App.css` — Ocean Professional theme variables, layout & styles
- `src/index.css` — Global base styles
- `src/components/Header.js` — App title, search, sort, theme toggle
- `src/components/NotesList.js` — Renders pinned/other notes lists
- `src/components/NoteItem.js` — Single row with pin/delete actions
- `src/components/NoteEditor.js` — Editor with title and auto‑resizing textarea
- `src/hooks/useLocalStorage.js` — Reusable localStorage hook
- `src/utils/storage.js` — Data model helpers and constants
- `src/utils/format.js` — Date formatting utilities

## Accessibility

- Semantic regions and labels for header, lists, and editor
- Keyboard navigation:
  - Enter/Space to select a note
  - Ctrl/Cmd+N to create a new note
- Visible focus rings
- ARIA attributes:
  - `aria-current` on selected note
  - `aria-live` for save status

## Limitations

- LocalStorage only (no syncing across devices)
- Single‑user, single‑tab (basic cross‑tab sync for theme and notes writes via storage events in the hook)

## License

MIT
