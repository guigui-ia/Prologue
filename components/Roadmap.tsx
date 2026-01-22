
import React from 'react';
import { GamePhase } from '../types';

interface RoadmapProps {
  currentPhase: GamePhase;
}

const PHASES = [
  { id: GamePhase.PHASE_1, label: 'STEP 1', icon: '✦' },
  { id: GamePhase.PHASE_2, label: 'STEP 2', icon: '⬢' },
  { id: GamePhase.PHASE_3, label: 'STEP 3', icon: '🏛' },
  { id: GamePhase.PHASE_4, label: 'FINISH', icon: '♾' },
];

export const Roadmap: React.FC<RoadmapProps> = ({ currentPhase }) => {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-8">
      <div className="relative flex justify-between items-center">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-purple-500 -z-10 -translate-y-1/2 transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          style={{ width: `${(currentIndex / (PHASES.length - 1)) * 100}%` }}
        ></div>

        {PHASES.map((p, i) => {
          const isActive = i <= currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <div key={p.id} className="flex flex-col items-center group">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 bg-black border ${
                  isActive ? 'border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'border-white/10 text-white/10'
                } ${isCurrent ? 'scale-125 bg-purple-500 text-white' : 'scale-100'}`}
              >
                {p.icon}
              </div>
              <span className={`mt-4 text-[8px] font-black tracking-[0.4em] transition-colors ${isActive ? 'text-white' : 'text-white/10'}`}>
                {p.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
