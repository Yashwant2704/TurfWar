import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import MoneyManager from '../components/MoneyManager'; 
// IMPORT LOADERS
import { PageLoader, ButtonLoader } from '../components/Loader';
import { LogOut, ShieldCheck, PlusCircle, MapPin, Calendar, Clock, DollarSign, Type, Trophy, X, Edit2, Save, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  
  // State for initial page load
  const [isLoading, setIsLoading] = useState(true);
  // State for button actions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({ title: '', turfName: '', date: '', costPerHour: 1000, durationHours: 2 });

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    // Only trigger full page load on first render or explicit refresh, not every update
    if(matches.length === 0) setIsLoading(true);
    try {
      const res = await client.get('/matches');
      setMatches(res.data);
      if (selectedMatch) {
        const updated = res.data.find(m => m._id === selectedMatch._id);
        if (updated) setSelectedMatch(updated);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  };

  const createMatch = async (e) => {
    const url = `/matches`;
    e.preventDefault();
    setIsSubmitting(true); // Button Loader
    try {
      await client.post(url, form, { headers: { 'x-auth-token': token } });
      alert("Match scheduled successfully!");
      setForm({ title: '', turfName: '', date: '', costPerHour: 1000, durationHours: 2 });
      fetchMatches();
    } catch (err) { alert("Failed to create match."); }
    setIsSubmitting(false);
  };

  // ... (Keep finalizeMatch, startEditing, saveEdit, closeMatchModal as they were) ...
  const finalizeMatch = async (e, id) => {
    const url = `/matches/${id}/score`;
    e.stopPropagation();
    const winner = prompt("Who won? (Team A / Team B)");
    if (!winner) return;
    try {
      await client.put(url, { winner, score: 'Completed' }, { headers: { 'x-auth-token': token } });
      fetchMatches();
      setSelectedMatch(null); 
    } catch (err) { alert("Error"); }
  };

  const startEditing = () => {
    setEditForm({
      title: selectedMatch.title,
      turfName: selectedMatch.turfName,
      date: selectedMatch.date ? new Date(selectedMatch.date).toISOString().slice(0, 16) : '',
      costPerHour: selectedMatch.costPerHour,
      durationHours: selectedMatch.durationHours
    });
    setIsEditing(true);
  };

  const saveEdit = async () => {
    const url = `/matches/${selectedMatch._id}`;
    try {
      await client.put(url, editForm, { headers: { 'x-auth-token': token } });
      setIsEditing(false);
      fetchMatches();
    } catch (err) { alert("Failed to update match"); }
  };

  const closeMatchModal = () => {
    setSelectedMatch(null);
    setIsEditing(false);
  };


  // 1. SHOW PAGE LOADER IF FETCHING INITIAL DATA
  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen font-sans bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-200/60 via-teal-50/20 to-slate-100">
      
      {/* Navbar (Same as before) */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg shadow-sm shadow-emerald-200">
                <Trophy className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                TURF<span className="text-emerald-700">WAR</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-1.5 bg-white/50 border border-white/60 rounded-full shadow-sm backdrop-blur-sm">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Organizer</span>
                </div>
                <div className="h-8 w-8 bg-white border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Create Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-6 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2"><PlusCircle size={24} className="text-emerald-300" /> Schedule Match</h2>
            <p className="text-emerald-100 text-sm mt-1">Create a new lobby for players to join.</p>
          </div>
          <form onSubmit={createMatch} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Match Title</label>
              <div className="relative mt-1">
                <Type className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input className="input-field pl-10" placeholder="e.g. Sunday Morning Blitz" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Location</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input className="input-field pl-10" placeholder="e.g. Green Valley" value={form.turfName} onChange={e => setForm({...form, turfName: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Date</label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input type="datetime-local" className="input-field pl-10 text-gray-600" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Duration (Hrs)</label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input type="number" className="input-field pl-10" value={form.durationHours} onChange={e => setForm({...form, durationHours: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Cost (₹)</label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                <input type="number" className="input-field pl-10" value={form.costPerHour} onChange={e => setForm({...form, costPerHour: e.target.value})} />
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2 pt-2">
              {/* 2. USE BUTTON LOADER HERE */}
              <button disabled={isSubmitting} className="btn-primary w-full py-3 shadow-md flex justify-center items-center gap-2">
                {isSubmitting ? <><ButtonLoader /> Creating...</> : 'Create Match'}
              </button>
            </div>
          </form>
        </div>

        {/* Managed Matches List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl shadow-gray-200/50 border border-white/50">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Your Matches</h2>
            <span className="badge bg-white border border-gray-300 text-gray-600 shadow-sm">{matches.length} Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-700 uppercase font-bold text-xs">
                <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matches.map(m => (
                  <tr 
                    key={m._id} 
                    onClick={() => setSelectedMatch(m)} 
                    className="hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-emerald-900">{new Date(m.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-emerald-800">{m.title}</td>
                    <td className="px-6 py-4">
                      {m.result?.isCompleted 
                        ? <span className="badge bg-gray-100 text-gray-600">Completed</span> 
                        : <span className="badge bg-emerald-100 text-emerald-700">Upcoming</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!m.result?.isCompleted && (
                        <button 
                          onClick={(e) => finalizeMatch(e, m._id)} 
                          className="text-emerald-600 hover:underline font-bold flex items-center gap-1 justify-end ml-auto z-10 relative"
                        >
                          <Trophy size={14}/> Finalize
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MATCH DETAILS MODAL (Same content as before, just kept concise for this response) */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="bg-emerald-900 p-6 flex justify-between items-start text-white sticky top-0 z-10">
              <div className="w-full">
                {isEditing ? (
                   <input className="bg-emerald-800 text-white font-bold text-2xl w-full p-2 rounded outline-none border border-emerald-600 focus:border-emerald-400"
                     value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}/>
                ) : ( <h3 className="text-2xl font-bold">{selectedMatch.title}</h3> )}

                {isEditing ? (
                   <div className="flex items-center gap-2 mt-2">
                     <MapPin size={16} className="text-emerald-300"/>
                     <input className="bg-emerald-800 text-white text-sm w-1/2 p-1 rounded outline-none border border-emerald-600"
                       value={editForm.turfName} onChange={(e) => setEditForm({...editForm, turfName: e.target.value})}/>
                   </div>
                ) : ( <p className="text-emerald-200 flex items-center gap-1 mt-1"><MapPin size={14} /> {selectedMatch.turfName}</p> )}
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                 {!selectedMatch.result?.isCompleted && (
                    isEditing ? (
                        <>
                            <button onClick={saveEdit} className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-full text-white transition"><Save size={20} /></button>
                            <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500 hover:bg-red-400 rounded-full text-white transition"><XCircle size={20} /></button>
                        </>
                    ) : ( <button onClick={startEditing} className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-full text-emerald-200 hover:text-white transition"><Edit2 size={20} /></button> )
                 )}
                 <button onClick={closeMatchModal} className="text-emerald-300 hover:text-white transition"><X size={24} /></button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {isEditing ? (
                 <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                        <input type="datetime-local" className="w-full mt-1 p-2 border rounded text-sm" value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Cost</label>
                        <input type="number" className="w-full mt-1 p-2 border rounded text-sm" value={editForm.costPerHour} onChange={(e) => setEditForm({...editForm, costPerHour: e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
                        <input type="number" className="w-full mt-1 p-2 border rounded text-sm" value={editForm.durationHours} onChange={(e) => setEditForm({...editForm, durationHours: e.target.value})}/></div>
                 </div>
              ) : (
                <>
                    <div className="flex gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg flex-1 text-center border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-bold">Date</p><p className="text-gray-900 font-bold">{new Date(selectedMatch.date).toLocaleDateString()}</p></div>
                        <div className="bg-gray-50 p-3 rounded-lg flex-1 text-center border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-bold">Cost</p><p className="text-gray-900 font-bold">₹{selectedMatch.costPerHour}</p></div>
                        <div className="bg-gray-50 p-3 rounded-lg flex-1 text-center border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-bold">Players</p><p className="text-gray-900 font-bold">{selectedMatch.players?.length || 0}</p></div>
                    </div>
                    <MoneyManager match={selectedMatch} user={user} token={token} onUpdate={fetchMatches} />
                </>
              )}
              {selectedMatch.result?.isCompleted && (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg text-center mt-4">
                   <p className="text-emerald-800 text-sm font-bold">Match Completed</p>
                   <p className="text-emerald-600 text-xs mt-1">Winner: {selectedMatch.result.winner}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}