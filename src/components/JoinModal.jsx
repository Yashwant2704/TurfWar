import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { X } from 'lucide-react';

export default function JoinModal({ matchId, onClose, onSuccess }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ role: 'All-Rounder', skill: 5 });
  const [loading, setLoading] = useState(false);
  const url = `/matches/${matchId}/join`;
  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post(url, form, {
        headers: { 'x-auth-token': token }
      });
      onSuccess();
      onClose();
    } catch (err) { 
      alert(err.response?.data?.message || 'Error'); 
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Join the Squad</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleJoin} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Role</label>
            <select className="input-field bg-white" onChange={e => setForm({...form, role: e.target.value})}>
              <option>All-Rounder</option>
              <option>Batsman</option>
              <option>Bowler</option>
              <option>Wicket Keeper</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Self Rating (1-10)</label>
            <div className="flex items-center gap-3">
              <input 
                type="range" min="1" max="10" 
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                value={form.skill} 
                onChange={e => setForm({...form, skill: e.target.value})} 
              />
              <span className="font-bold text-emerald-700 w-6 text-center">{form.skill}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Be honest! This is used for auto-balancing.</p>
          </div>

          <div className="pt-2">
            <button disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Joining...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}