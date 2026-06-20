"use client";

import React, { useState } from 'react';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotesSection({ clientId, existingNotes }: { clientId: string, existingNotes: any[] }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, content }),
      });
      if (res.ok) {
        setContent("");
        router.refresh();
      } else {
        alert("Failed to add note");
      }
    } catch (err) {
      alert("Error adding note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-full">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-violet-500" /> CRM Notes & Activity
      </h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[400px] pr-2">
        {existingNotes.length === 0 ? (
          <div className="text-sm text-slate-500 italic text-center py-8">
            No notes added for this client yet.
          </div>
        ) : (
          existingNotes.map(note => (
            <div key={note.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-500 font-bold mb-1">
                {new Date(note.createdAt).toLocaleString()}
              </div>
              <div className="text-sm font-semibold">{note.content}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddNote} className="relative mt-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note about a meeting, call, or preference..."
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:border-blue-500 resize-none h-20 text-sm font-semibold"
        />
        <button 
          type="submit" 
          disabled={isLoading || !content.trim()}
          className="absolute right-2 bottom-2 p-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 transition"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
