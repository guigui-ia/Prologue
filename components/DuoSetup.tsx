
import React, { useState, useEffect } from 'react';
import { DuoContext, Participant, GamePhase } from '../types';

interface DuoSetupProps {
  onComplete: (context: DuoContext) => void;
  initialData?: DuoContext | null; // Permet de charger un duo partiel
}

const COLORS = ['#8b5cf6', '#f43f5e', '#3b82f6', '#10b981', '#fbbf24'];

export const DuoSetup: React.FC<DuoSetupProps> = ({ onComplete, initialData }) => {
  const isJoining = !!initialData;
  const [duoName, setDuoName] = useState(initialData?.duoName || '');
  const [p1, setP1] = useState<Participant>(initialData?.p1 || { name: '', rhythm: 'Mixte', preferences: [], avatarColor: COLORS[0] });
  const [p2, setP2] = useState<Participant>(initialData?.p2 || { name: '', rhythm: 'Mixte', preferences: [], avatarColor: COLORS[2] });
  const [budget, setBudget] = useState<DuoContext['budget']>(initialData?.budget || 'Confort');
  const [prefInput, setPrefInput] = useState('');

  const handleAction = () => {
    if (!duoName || (isJoining ? !p2.name : !p1.name)) return;
    
    const finalP2 = isJoining ? { ...p2, preferences: prefInput.split(',').map(s => s.trim()) } : p2;
    const finalP1 = !isJoining ? { ...p1, preferences: prefInput.split(',').map(s => s.trim()) } : p1;

    onComplete({
      id: initialData?.id || Math.random().toString(36).substr(2, 6).toUpperCase(),
      duoName,
      p1: finalP1,
      p2: finalP2,
      budget,
      currentPhase: initialData?.currentPhase || GamePhase.PHASE_1
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 animate-fade-in p-6 pb-20">
      <div className="text-center space-y-6">
        <h2 className="font-header text-4xl font-extrabold tracking-tighter">
          {isJoining ? "REJOINDRE L'ALLIANCE" : "CRÉER VOTRE ALLIANCE"}
        </h2>
        {isJoining ? (
          <div className="flex flex-col items-center gap-4">
            <span className="text-purple-500 font-header text-2xl uppercase tracking-widest">{duoName}</span>
            <p className="font-serif-elegant italic text-white/40">
              Invitée par <span className="text-white">{p1.name}</span>
            </p>
          </div>
        ) : (
          <input 
            type="text" 
            placeholder="NOM DU DUO..." 
            className="text-center w-full bg-transparent border-b-2 border-white/10 py-4 font-header text-2xl focus:border-purple-500 transition-all outline-none uppercase tracking-[0.2em] ink-gradient"
            value={duoName}
            onChange={(e) => setDuoName(e.target.value)}
          />
        )}
      </div>

      <div className="space-y-8">
        <div className="glass p-8 rounded-3xl space-y-6 relative overflow-hidden group border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
              {isJoining ? 'PLAYER 2 (TOI)' : 'PLAYER 1 (TOI)'}
            </span>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button 
                  key={c} 
                  onClick={() => isJoining ? setP2({...p2, avatarColor: c}) : setP1({...p1, avatarColor: c})}
                  className={`w-4 h-4 rounded-full transition-all ${ (isJoining ? p2.avatarColor : p1.avatarColor) === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-30'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          
          <input 
            type="text" 
            placeholder="TON PRÉNOM" 
            className="w-full bg-transparent border-b border-white/10 py-3 font-bold text-xl focus:border-white transition-colors outline-none"
            value={isJoining ? p2.name : p1.name}
            onChange={(e) => isJoining ? setP2({...p2, name: e.target.value}) : setP1({...p1, name: e.target.value})}
          />
          
          <div className="grid grid-cols-3 gap-2">
            {['Chill', 'Mixte', 'Action'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => isJoining ? setP2({...p2, rhythm: r as any}) : setP1({...p1, rhythm: r as any})}
                className={`py-2 text-[10px] font-bold rounded-full border transition-all ${ (isJoining ? p2.rhythm : p1.rhythm) === r ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <textarea 
            placeholder="TES PASSIONS (TECH, JAZZ, VIN...)" 
            className="w-full bg-black/40 border border-white/5 p-4 text-xs rounded-2xl h-24 outline-none focus:border-white/20 transition-all font-serif-elegant italic text-white/80"
            value={prefInput}
            onChange={(e) => setPrefInput(e.target.value)}
          />
        </div>

        {!isJoining && (
          <div className="w-full space-y-4 pt-6">
            <label className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase text-center block">LEVEL DE BUDGET GLOBAL</label>
            <div className="flex justify-center gap-3">
              {['Étudiant', 'Confort', 'No Limit'].map((b) => (
                <button 
                  key={b}
                  type="button"
                  onClick={() => setBudget(b as any)}
                  className={`px-6 py-3 text-[10px] font-bold border-2 rounded-xl transition-all ${budget === b ? 'bg-white text-black border-white shadow-xl' : 'border-white/5 text-white/20 hover:border-white/20'}`}
                >
                  {b.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center pt-8">
        <button 
          onClick={handleAction}
          className="w-full py-6 bg-white text-black font-black text-sm tracking-[0.5em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          {isJoining ? 'FINALISER MON PROFIL' : 'GÉNÉRER LE LIEN BASTIEN'}
        </button>
      </div>
    </div>
  );
};
