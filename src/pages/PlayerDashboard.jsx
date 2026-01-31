import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';
import JoinModal from '../components/JoinModal';
import { LogOut, User, Trophy, Search } from 'lucide-react';
import client from '../api/client';

export default function PlayerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [joinId, setJoinId] = useState(null);

  useEffect(() => { fetchMatches(); }, []);

  const fetchMatches = async () => {
    try {
      const res = await client.get('/matches');
      setMatches(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    // UPDATED: Stronger Gradient (Emerald-200 start, fading to Slate-100)
    <div className="min-h-screen font-sans bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-emerald-200/60 via-teal-50/20 to-slate-100">
      
      {/* Navbar: Glassmorphism will catch the green tint behind it now */}
      <nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg shadow-sm shadow-emerald-200">
                <Trophy className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                TURF<span className="text-emerald-700">WAR</span>
              </span>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 pl-4 pr-2 py-1.5 bg-white/50 border border-white/60 rounded-full shadow-sm backdrop-blur-sm">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-sm font-bold text-gray-900">{user.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Player</span>
                </div>
                <div className="h-8 w-8 bg-white border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <User size={18} />
                </div>
              </div>

              <button 
                onClick={logout} 
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Match Feed</h1>
            <p className="text-gray-600 font-medium mt-1">Find a game, join a squad, and dominate the turf.</p>
          </div>
          {/* Search Bar - darker background to stand out against the new gradient */}
          <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-2 text-gray-400 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search size={18} className="text-emerald-600"/>
            <span className="text-sm font-medium">Search turfs...</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(m => (
            <MatchCard key={m._id} match={m} onJoin={() => setJoinId(m._id)} />
          ))}
          {matches.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-lg shadow-emerald-100">
                <Trophy size={40} className="text-emerald-300"/>
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Matches Found</h3>
              <p className="text-gray-500">Check back later or ask an organizer to schedule one.</p>
            </div>
          )}
        </div>
      </main>

      {joinId && <JoinModal matchId={joinId} onClose={() => setJoinId(null)} onSuccess={fetchMatches} />}
    </div>
  );
}