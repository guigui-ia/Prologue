
import React, { useState } from 'react';
import { MissionResponse, Participant } from '../types';
import { speakMission } from '../services/geminiService';

interface MissionResultProps {
  mission: MissionResponse;
  p1: Participant;
  p2: Participant;
  onReset: () => void;
  onCapture: () => void;
}

export const MissionResult: React.FC<MissionResultProps> = ({ mission, p1, p2, onReset, onCapture }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [revealedA, setRevealedA] = useState(false);
  const [revealedB, setRevealedB] = useState(false);
  const [isModeImmersion, setIsModeImmersion] = useState(false);

  const handleSpeak = async () => {
    setIsSpeaking(true);
    await speakMission(mission.mission_description);
    setTimeout(() => setIsSpeaking(false), 10000);
  };

  if (isModeImmersion) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-12 text-center space-y-12 animate-fade-in">
        <div className="relative">
          <div className="w-32 h-32 border border-white/10 rounded-full animate-ping absolute inset-0"></div>
          <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/20 relative z-10">
            <span className="text-4xl animate-float">📱📴</span>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="font-header text-2xl font-bold tracking-[0.4em] text-white">OFF-SCREEN</h2>
          <p className="font-serif-elegant italic text-white/50 text-xl leading-relaxed">
            "Le téléphone s'efface. La réalité commence."
          </p>
          <div className="glass p-10 rounded-3xl border-purple-500/30">
            <p className="text-purple-400 font-bold text-[10px] tracking-[0.5em] uppercase mb-4">NEXT STEP</p>
            <p className="text-white font-serif-elegant text-3xl leading-snug">{mission.instruction_coffret}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModeImmersion(false)}
          className="mt-12 text-[10px] font-bold tracking-[0.4em] text-white/30 uppercase border-b border-white/10 pb-2 hover:text-white transition-all"
        >
          QUIT IMMERSION
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in pb-20 space-y-8 px-4">
      {/* MISSION CARD (VERTICAL STORY FORMAT) */}
      <div className="glass rounded-[40px] p-10 space-y-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="text-8xl font-header">P</span>
        </div>
        
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-purple-500"></div>
            <span className="text-[10px] font-black tracking-[0.5em] text-purple-400 uppercase">MISSION UNLOCKED</span>
          </div>
          <h2 className="font-header text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
            {mission.titre_episode}
          </h2>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-bold text-white/60 border border-white/10 uppercase tracking-widest">{mission.vibe_generale}</span>
          </div>
        </header>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border-white/5 bg-white/[0.02]">
            <p className="font-serif-elegant text-2xl md:text-3xl leading-relaxed text-white/90 italic">
              "{mission.mission_description}"
            </p>
          </div>

          <div className="flex justify-between items-center py-4 border-y border-white/5">
            <div className="space-y-1">
              <span className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">LOCALISATION</span>
              <p className="text-xs font-bold text-white">{mission.specific_place_name || mission.lieu_type}</p>
            </div>
            <button onClick={handleSpeak} className={`p-4 rounded-full glass border-white/10 ${isSpeaking ? 'bg-purple-500 animate-pulse' : ''}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent">
                <span className="block text-[8px] font-black text-purple-400 uppercase tracking-widest mb-2">BONUS QUEST</span>
                <p className="text-[11px] font-serif-elegant italic text-white/70 leading-relaxed">{mission.defi_bonus}</p>
             </div>
             <div className="glass p-6 rounded-3xl border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent">
                <span className="block text-[8px] font-black text-amber-400 uppercase tracking-widest mb-2">DRESS CODE</span>
                <p className="text-[11px] font-serif-elegant italic text-white/70 leading-relaxed">{mission.dress_code}</p>
             </div>
          </div>
        </div>

        {mission.sources && mission.sources.length > 0 && (
          <div className="pt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mission.sources.map((source, idx) => (
              <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-[8px] font-bold text-white/30 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all uppercase tracking-widest">
                {source.title.slice(0, 15)}...
              </a>
            ))}
          </div>
        )}
      </div>

      {/* SECRET CARDS (TAP TO REVEAL) */}
      <div className="grid grid-cols-2 gap-4">
        {[ {p: p1, secret: mission.mission_secrete_a, rev: revealedA, set: setRevealedA},
           {p: p2, secret: mission.mission_secrete_b, rev: revealedB, set: setRevealedB} ].map((item, i) => (
          <div 
            key={i}
            onClick={() => item.set(!item.rev)}
            className={`cursor-pointer h-52 rounded-3xl border-2 transition-all duration-700 relative overflow-hidden group flex flex-col items-center justify-center p-6 text-center ${
              item.rev ? 'glass border-white/20 scale-95 shadow-inner' : 'bg-white text-black border-transparent shadow-2xl'
            }`}
          >
            <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-xs font-black mb-4" style={{ backgroundColor: item.rev ? item.p.avatarColor + '20' : item.p.avatarColor, color: item.rev ? item.p.avatarColor : 'white' }}>
              {item.p.name.charAt(0)}
            </div>
            <span className={`text-[8px] font-black tracking-[0.3em] uppercase mb-2 ${item.rev ? 'text-white/20' : 'text-black/40'}`}>TOP SECRET</span>
            {item.rev ? (
              <p className="text-[10px] font-serif-elegant italic text-white animate-fade-in leading-relaxed">{item.secret}</p>
            ) : (
              <span className="text-[10px] font-black uppercase text-black">POUR {item.p.name}</span>
            )}
            <div className="absolute top-2 right-2 opacity-10">🤫</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 py-10">
        <button 
          onClick={() => setIsModeImmersion(true)}
          className="w-full py-8 bg-purple-600 text-white font-black text-xs tracking-[0.6em] rounded-full hover:bg-purple-500 transition-all shadow-[0_20px_40px_rgba(139,92,246,0.3)] uppercase active:scale-95"
        >
          GO IMMERSION
        </button>
        
        <button 
          onClick={onCapture}
          className="w-full py-5 glass text-white/50 font-bold text-[10px] tracking-[0.5em] rounded-full hover:text-white transition-all uppercase"
        >
          CAPTURE MEMORY
        </button>

        <button onClick={onReset} className="text-[8px] font-bold tracking-[0.8em] text-white/10 hover:text-white/30 transition-all uppercase py-4">
          DELETE DRAFT
        </button>
      </div>
    </div>
  );
};
