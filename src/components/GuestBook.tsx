import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface GuestBookEntry {
  date: Date;
  name: string;
  message: string;
}

export function GuestBook() {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ name: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.message.trim()) {
      setEntries([
        { ...newEntry, date: new Date() },
        ...entries,
      ]);
      setNewEntry({ name: '', message: '' });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name (optional)</Label>
          <input
            type="text"
            id="name"
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2"
            placeholder="Dein Name..."
          />
        </div>
        <div>
          <Label htmlFor="message">Dein Eintrag</Label>
          <textarea
            id="message"
            value={newEntry.message}
            onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2"
            rows={4}
            placeholder="Teile deine Urlaubserlebnisse..."
          />
        </div>
        <Button type="submit">Eintrag hinzufügen</Button>
      </form>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">
                {entry.name || 'Anonym'}
              </div>
              <div className="text-sm text-neutral-500">
                {entry.date.toLocaleDateString('de-DE')}
              </div>
            </div>
            <p className="text-neutral-600 whitespace-pre-wrap">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}