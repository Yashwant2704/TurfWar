import React from 'react';

export default function SkillBadge({ level }) {
  let color = 'bg-gray-100 text-gray-800';
  if (level >= 8) color = 'bg-purple-100 text-purple-800 border-purple-200';
  else if (level >= 6) color = 'bg-green-100 text-green-800 border-green-200';
  else if (level >= 4) color = 'bg-blue-100 text-blue-800 border-blue-200';
  else color = 'bg-yellow-100 text-yellow-800 border-yellow-200';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${color}`}>
      Lvl {level}
    </span>
  );
}