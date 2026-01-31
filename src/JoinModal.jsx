import React, { useState } from 'react';

export default function JoinModal({ isOpen, onClose, onJoin }) {
  const [formData, setFormData] = useState({ name: '', role: 'All-Rounder', skill: 5 });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(formData);
    setFormData({ name: '', role: 'All-Rounder', skill: 5 }); // Reset
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Join the Squad</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your Name</label>
            <input 
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select 
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-Rounder</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Skill (1-10)</label>
              <input 
                type="number" min="1" max="10"
                className="w-full mt-1 p-2 border rounded-lg"
                value={formData.skill}
                onChange={e => setFormData({...formData, skill: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-gray-500 font-semibold hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}