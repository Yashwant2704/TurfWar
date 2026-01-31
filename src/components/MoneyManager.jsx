import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Settings, Wallet, UserPlus, Save, X } from 'lucide-react';
import client from '../api/client';

export default function MoneyManager({ match, user, token, onUpdate }) {
  const [loadingId, setLoadingId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [upiId, setUpiId] = useState(user.upiId || '');
  
  // NEW: State for adding a guest
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '' });

  const [players, setPlayers] = useState(match.players);

  useEffect(() => {
    setPlayers(match.players);
  }, [match.players]);

  const totalCost = match.costPerHour * match.durationHours;
  const playerCount = players.length;
  const costPerHead = playerCount > 0 ? Math.round(totalCost / playerCount) : 0;
  

  const togglePayment = async (playerId, currentStatus) => {
    const url = `/matches/${match._id}/payment`;
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    const updatedPlayers = players.map(p => 
      p._id === playerId ? { ...p, paymentStatus: newStatus } : p
    );
    setPlayers(updatedPlayers);

    try {
      await client.put(url, 
        { playerId, status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      onUpdate(); 
    } catch (err) {
      alert("Failed to update payment status");
      setPlayers(match.players); 
    }
  };

  const sendReminder = async (playerId) => {
    const url = `/finance/remind`;
    setLoadingId(playerId);
    try {
      await client.post(url, 
        { matchId: match._id, playerId },
        { headers: { 'x-auth-token': token } }
      );
      alert("📧 Payment link sent!");
    } catch (err) {
      alert("Failed to send email (Guest might not have email configured).");
    }
    setLoadingId(null);
  };

  const saveUpi = async () => {
    const url = `/finance/upi`;
    try {
      await axios.put(url, 
        { upiId }, 
        { headers: { 'x-auth-token': token } }
      );
      alert("UPI ID Saved!");
      setShowSettings(false);
    } catch (err) { alert("Error saving UPI"); }
  };

  // NEW: Function to add guest
  const handleAddGuest = async () => {
    const url = `/matches/${match._id}/guest`;
    if (!guestForm.name) return alert("Name is required");
    try {
        await axios.post(url, 
            guestForm,
            { headers: { 'x-auth-token': token } }
        );
        setShowAddGuest(false);
        setGuestForm({ name: '', email: '' });
        onUpdate(); // Refresh parent to see new player
    } catch (err) {
        alert("Failed to add guest");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-6 shadow-sm transition-colors duration-300">
      <div className="bg-gray-900 dark:bg-black p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Wallet className="text-emerald-400" size={20}/> Finance Center
        </h3>
        <div className="flex gap-2">
            {/* NEW: Add Guest Button */}
            <button onClick={() => setShowAddGuest(!showAddGuest)} className="text-emerald-400 hover:text-white transition">
                <UserPlus size={18} />
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="text-gray-400 hover:text-white transition">
                <Settings size={18} />
            </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your UPI ID (VPA)</label>
          <div className="flex gap-2">
            <input 
              value={upiId} 
              onChange={e => setUpiId(e.target.value)}
              placeholder="e.g. yourname@oksbi" 
              className="flex-1 p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button onClick={saveUpi} className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold">Save</button>
          </div>
        </div>
      )}

      {/* NEW: Guest Entry Form */}
      {showAddGuest && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-emerald-900/50 animate-in slide-in-from-top-2">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Add Manual Guest</p>
            <div className="flex gap-2">
                <input 
                    placeholder="Guest Name"
                    className="flex-1 p-2 text-sm border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={guestForm.name}
                    onChange={e => setGuestForm({...guestForm, name: e.target.value})}
                />
                 <input 
                    placeholder="Email (Optional)"
                    className="flex-1 p-2 text-sm border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={guestForm.email}
                    onChange={e => setGuestForm({...guestForm, email: e.target.value})}
                />
                <button onClick={handleAddGuest} className="bg-emerald-600 text-white p-2 rounded hover:bg-emerald-500">
                    <Save size={18} />
                </button>
                 <button onClick={() => setShowAddGuest(false)} className="bg-white text-gray-500 border p-2 rounded hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                    <X size={18} />
                </button>
            </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-center mb-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Cost Per Head:</span>
          <span className="font-bold text-xl text-gray-900 dark:text-white">₹{costPerHead}</span>
        </div>

        <div className="space-y-3">
          {players.map(p => (
            <div key={p._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${p.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                <div>
                  <div className="flex items-center gap-2">
                     <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{p.name}</p>
                     {p.isGuest && <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 rounded">GUEST</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{p.paymentStatus}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {p.paymentStatus !== 'Paid' && (
                  <button 
                    onClick={() => sendReminder(p._id)} 
                    disabled={loadingId === p._id}
                    className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                  >
                    {loadingId === p._id ? '...' : <Send size={16}/>}
                  </button>
                )}

                <button 
                  onClick={() => togglePayment(p._id, p.paymentStatus)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                    p.paymentStatus === 'Paid' 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.paymentStatus === 'Paid' ? 'PAID' : 'MARK PAID'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}