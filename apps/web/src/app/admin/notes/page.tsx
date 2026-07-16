'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch notes from API
    setNotes([]);
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-[var(--neutral-gray-600)]">Manage your notes</p>
        </div>
        <button className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded-lg hover:bg-[var(--color-info)] transition-colors">
          Add Note
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-[var(--neutral-gray-600)]">Loading notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-lg border border-[var(--neutral-gray-200)]">
          <p className="text-[var(--neutral-gray-600)] mb-4">No notes found</p>
          <button className="px-4 py-2 bg-[var(--color-info)] text-[var(--foreground)] rounded-lg hover:bg-[var(--color-info)] transition-colors">
            Add Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-surface rounded-lg border border-[var(--neutral-gray-200)] p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-[var(--foreground)] mb-2">{note.title}</h3>
              <p className="text-sm text-[var(--neutral-gray-600)] mb-4 line-clamp-3">{note.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--neutral-gray-500)]">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button className="text-[var(--color-info)] hover:text-blue-900 text-sm">Edit</button>
                  <button className="text-[var(--color-error)] hover:text-red-900 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}