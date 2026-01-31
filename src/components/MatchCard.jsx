import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, Trophy, MessageCircle } from 'lucide-react';
import TeamBalancer from '../TeamBalancer';
import MatchChat from '../MatchChat';

export default function MatchCard({ match, onJoin }) {
  const [showChat, setShowChat] = useState(false);
  const isCompleted = match.result && match.result.isCompleted;
  const playerCount = match.players.length;

  return (
    <div className="card flex flex-col h-full group">
      {/* Header Image / Color Block */}
      <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Status */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
            {match.title}
          </h3>
          {isCompleted ? (
            <span className="badge bg-gray-100 text-gray-600 border border-gray-200">Done</span>
          ) : (
             <span className="badge bg-green-50 text-green-700 border border-green-200">Open</span>
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span className="font-medium">{match.turfName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span>{new Date(match.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
           <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span>{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({match.durationHours}h)</span>
          </div>
        </div>

        {/* Player Avatars */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <Users size={16} className="text-emerald-600"/>
              {playerCount} Players
            </div>
            <div className="flex -space-x-2">
              {match.players.slice(0, 4).map((p, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-800" title={p.name}>
                  {p.name.charAt(0)}
                </div>
              ))}
              {playerCount > 4 && (
                <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[9px] text-gray-600">
                  +{playerCount - 4}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isCompleted && (
              <button onClick={onJoin} className="btn-primary flex-1 text-sm py-2">
                Join
              </button>
            )}
            <button 
              onClick={() => setShowChat(!showChat)} 
              className={`px-3 py-2 rounded-lg border transition-colors ${showChat ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}
            >
              <MessageCircle size={18}/>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      {(showChat || match.players.length > 0) && (
        <div className="bg-gray-50 border-t border-gray-100 p-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
           <TeamBalancer players={match.players} />
           {showChat && <MatchChat matchId={match._id} comments={match.comments} />}
        </div>
      )}
    </div>
  );
}