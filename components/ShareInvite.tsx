
import React, { useState } from 'react';
import { DuoContext } from '../types';

interface ShareInviteProps {
  duo: DuoContext;
  onContinue: () => void;
}

export const ShareInvite: React.FC<ShareInviteProps> = ({ duo, onContinue }) => {
  const [copied, setCopied] = useState(false);
  
  // Create a ultra-compact version of the duo context for the URL
  const generateShortLink = () => {
    const compact = {
      n: duo.duoName,
      b: duo.budget,
      s: duo.currentPhase,
      a: { // Architect (p1)
        n: duo.p1.name,
        c: duo.p1.avatarColor,
        r: duo.p1.rhythm,
        p: duo.p1.preferences
      }
    };

    const str = JSON.stringify(compact);
    // Standard Base64 but making it URL safe by replacing problematic chars
    const base64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
      String.fromCharCode(parseInt(p1, 16))
    ))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
    return `${window.location.origin}${window.location.pathname}?a=${base64}`;
  };

  const inviteLink = generateShortLink();

  const handleCopy = () => {
    if (navigator.share) {
      navigator.share({
        title: 'PROLOGUE - Alliance',
        text: `Bastien, rejoins notre alliance "${duo.duoName}" sur PROLOGUE !`,
        url: inviteLink,
      }).catch(() => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
      });
    } else {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    }
    
    if (!navigator.share) {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-10 text-center py-10 px-6">
      <div className="space-y-6">
        <div className="w-24 h-24 glass rounded-full flex items-center justify-center border-purple-500/30 mx-auto shadow-[0_0_30px_rgba(139,92,246,0.2)]">
          <span className="text-4xl animate-pulse">✨</span>
        </div>
        <h2 className="font-header text-3xl font-black tracking-tight text-white uppercase">INVITE TON BINÔME</h2>
        <p className="font-serif-elegant italic text-white/50 text-xl leading-relaxed">
          "Ton lien d'alliance a été optimisé. Envoie-le à Bastien pour qu'il puisse graver son profil."
        </p>
      </div>

      <div className="glass p-8 rounded-[40px] border-white/5 bg-white/[0.01] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-30"></div>
        
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
          <p className="text-[10px] text-purple-400 font-mono truncate tracking-tight opacity-40 italic">
            {inviteLink.split('?')[0]}?a=...{inviteLink.slice(-10)}
          </p>
        </div>

        <button 
          onClick={handleCopy}
          className={`w-full py-6 rounded-full font-black text-xs tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-3 ${
            copied ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-black shadow-xl hover:scale-105 active:scale-95'
          }`}
        >
          {copied ? 'LIEN COPIÉ !' : 'PARTAGER À BASTIEN'}
        </button>
      </div>

      <button 
        onClick={onContinue}
        className="text-[10px] font-bold tracking-[0.6em] text-white/20 hover:text-white transition-all uppercase border-b border-white/5 pb-2"
      >
        CONTINUER SEUL
      </button>
    </div>
  );
};
