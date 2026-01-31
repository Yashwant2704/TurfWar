import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import client from './api/client';

export default function MatchChat({ matchId, comments }) {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState('');

  const url = `/matches/${matchId}/comment`;
  const send = async (e) => {
    e.preventDefault();
    if (!text) return;
    await client.post(url, { text }, { headers: { 'x-auth-token': token } });
    window.location.reload(); // Simple reload to refresh chat
  };

  return (
    <div className="mt-4 border-t pt-2">
      <div className="h-32 overflow-y-auto bg-gray-50 p-2 rounded mb-2 text-sm">
        {comments.map((c, i) => (
          <div key={i}><strong>{c.user}:</strong> {c.text}</div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input className="flex-1 border p-1 rounded text-sm" placeholder="Chat..." value={text} onChange={e => setText(e.target.value)} />
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Send</button>
      </form>
    </div>
  );
}