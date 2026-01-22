
import React, { useState, useEffect } from 'react';
import { DuoContext } from '../types';

interface PartnerStatusProps {
  duo: DuoContext;
  onShare: () => void;
}

export const PartnerStatus: React.FC<PartnerStatusProps> = ({ duo, onShare }) => {
  const [status, setStatus] = useState<'Connecté' | 'Prêt' | 'Arrivé'>('Connecté');
  const partnerName = duo.p2.name;

  useEffect(() => {
    const timer = setTimeout(() => setStatus('Prêt'), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full glass border-b border-white/5 px-6 py-3 flex justify-between items-center fixed top-0 left-0 z-40">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-black tracking-[0.3em] text-white/30 uppercase leading-none mb-1">ALLIANCE</span>
          <span className="text-[10px] text-white font-bold">{duo.duoName}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={onShare}
          className="text-white/20 hover:text-white transition-colors"
          title="Partager le lien"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-[8px] text-white/30 uppercase font-black tracking-widest leading-none mb-1">DUO : {partnerName}</span>
            <span className="block text-[10px] text-purple-400 font-serif-elegant italic">{status}</span>
          </div>
          <div 
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black shadow-lg"
            style={{ backgroundColor: duo.p2.avatarColor + '20', color: duo.p2.avatarColor }}
          >
            {partnerName.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};
