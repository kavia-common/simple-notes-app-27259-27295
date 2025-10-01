export const STORAGE_KEY = 'ocean-notes:v1';

/**
 * Note data model
 * { id, title, content, createdAt, updatedAt, pinned, color }
 */

const colors = ['default', 'blue', 'amber', 'green', 'pink', 'purple'];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
export const storage = {
  /** Create a new note with defaults and optional overrides */
  createNote(overrides = {}) {
    const now = Date.now();
    return {
      id: uid(),
      title: overrides.title ?? '',
      content: overrides.content ?? '',
      createdAt: overrides.createdAt ?? now,
      updatedAt: overrides.updatedAt ?? now,
      pinned: overrides.pinned ?? false,
      color: colors.includes(overrides.color) ? overrides.color : 'default',
    };
  },
};
