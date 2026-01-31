import React, { useState } from 'react';

export default function TeamBalancer({ players }) {
  const [teams, setTeams] = useState(null);

  const balance = () => {
    if (players.length < 2) return;
    const sorted = [...players].sort((a, b) => b.skill - a.skill);
    const teamA = [], teamB = [];
    let skillA = 0, skillB = 0;

    sorted.forEach(p => {
      if (skillA <= skillB) { teamA.push(p); skillA += parseInt(p.skill); } 
      else { teamB.push(p); skillB += parseInt(p.skill); }
    });
    setTeams({ teamA, teamB });
  };

  if (!teams) return <button onClick={balance} className="text-xs text-blue-600 underline mt-2">Preview Balanced Teams</button>;

  return (
    <div className="grid grid-cols-2 gap-2 mt-4 bg-gray-50 p-2 rounded border">
      <div><h4 className="font-bold text-blue-800 text-xs">Team A</h4>{teams.teamA.map((p,i)=><div key={i} className="text-xs">{p.name}</div>)}</div>
      <div><h4 className="font-bold text-red-800 text-xs">Team B</h4>{teams.teamB.map((p,i)=><div key={i} className="text-xs">{p.name}</div>)}</div>
    </div>
  );
}