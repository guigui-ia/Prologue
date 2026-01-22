
import React from 'react';
import { LocationType, GamePhase, MissionFormData } from '../types';

interface MissionFormProps {
  onGenerate: (data: MissionFormData) => void;
  isLoading: boolean;
}

const WEATHER_ICONS: Record<string, string> = {
  'Soleil radieux': '☀️',
  'Pluie fine / Orage': '⛈️',
  'Ciel couvert / Brume': '☁️',
  'Nuit étoilée': '✨',
  'Froid hivernal': '❄️',
};

const VIBES = ['Mystérieux', 'Aventureux', 'Intime', 'Chill', 'Électrique'];

export const MissionForm: React.FC<MissionFormProps> = ({ onGenerate, isLoading }) => {
  const [formData, setFormData] = React.useState<MissionFormData>({
    city: '',
    locationType: LocationType.CITY,
    weather: 'Soleil radieux',
    phase: GamePhase.PHASE_1,
    vibe: 'Chill',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city) return;
    onGenerate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-xl mx-auto py-10 px-4 animate-fade-in">
      <div className="space-y-10">
        {/* CITY INPUT */}
        <div className="space-y-4">
          <label className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">DESTINATION</label>
          <input
            type="text"
            required
            className="w-full bg-transparent border-b-2 border-white/10 py-4 font-header text-2xl focus:border-purple-500 transition-all outline-none uppercase placeholder:text-white/5"
            placeholder="Où êtes-vous ?"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        {/* WEATHER PILLS */}
        <div className="space-y-4">
          <label className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">ATMOSPHÈRE</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {Object.entries(WEATHER_ICONS).map(([name, icon]) => (
              <button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, weather: name })}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  formData.weather === name 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' 
                  : 'glass border-white/5 text-white/40 hover:border-white/20'
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span className="text-[8px] font-bold uppercase text-center leading-tight">{name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VIBE SELECTOR */}
        <div className="space-y-4">
          <label className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">VIBE DU RDV</label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setFormData({ ...formData, vibe: v })}
                className={`px-6 py-3 rounded-full text-[10px] font-bold border transition-all uppercase tracking-widest ${
                  formData.vibe === v 
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                  : 'glass border-white/5 text-white/30 hover:text-white/60'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.city}
        className="group relative w-full py-8 bg-white text-black font-black text-sm tracking-[0.6em] rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-20 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
      >
        <span className="relative z-10">GÉNÉRER L'ÉPISODE</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-amber-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
      </button>
    </form>
  );
};
