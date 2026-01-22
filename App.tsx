
import React, { useState, useEffect } from 'react';
import { DuoSetup } from './components/DuoSetup';
import { MissionForm } from './components/MissionForm';
import { MissionResult } from './components/MissionResult';
import { MemoryScanner } from './components/MemoryScanner';
import { MemoryGallery } from './components/MemoryGallery';
import { PartnerStatus } from './components/PartnerStatus';
import { Roadmap } from './components/Roadmap';
import { ShareInvite } from './components/ShareInvite';
import { generateMission } from './services/geminiService';
import { MissionRequest, MissionResponse, Memory, DuoContext, GamePhase, MissionFormData } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [duo, setDuo] = useState<DuoContext | null>(null);
  const [pendingDuo, setPendingDuo] = useState<DuoContext | null>(null);
  const [mission, setMission] = useState<MissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const decodeData = (base64Safe: string) => {
      try {
        // Restore standard Base64 from URL-safe version
        let base64 = base64Safe.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        
        const str = atob(base64);
        const jsonStr = decodeURIComponent(Array.prototype.map.call(str, (c) => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        
        const data = JSON.parse(jsonStr);

        // Map back from compact format if necessary
        if (data.n && data.a) {
          return {
            id: Math.random().toString(36).substr(2, 6).toUpperCase(),
            duoName: data.n,
            budget: data.b,
            currentPhase: data.s,
            p1: {
              name: data.a.n,
              avatarColor: data.a.c,
              rhythm: data.a.r,
              preferences: data.a.p
            },
            p2: { name: '', rhythm: 'Mixte', preferences: [], avatarColor: '#fbbf24' }
          } as DuoContext;
        }
        return data; // Backward compatibility
      } catch (e) {
        console.error("Decode error", e);
        return null;
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    // On check l'ancien paramètre 'alliance' ou le nouveau 'a' (plus court)
    const inviteData = urlParams.get('a') || urlParams.get('alliance');
    
    if (inviteData) {
      const decoded = decodeData(inviteData);
      if (decoded) {
        if (!decoded.p2.name) {
          setPendingDuo(decoded);
        } else {
          setDuo(decoded);
          localStorage.setItem('prologue_duo', JSON.stringify(decoded));
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else {
      const savedDuo = localStorage.getItem('prologue_duo');
      if (savedDuo) setDuo(JSON.parse(savedDuo));
    }

    const savedMemories = localStorage.getItem('prologue_memories');
    if (savedMemories) setMemories(JSON.parse(savedMemories));
  }, []);

  const handleDuoComplete = (context: DuoContext) => {
    if (!context.p2.name) {
      setPendingDuo(context);
      setShowShare(true);
    } else {
      setDuo(context);
      setPendingDuo(null);
      setShowShare(false);
      localStorage.setItem('prologue_duo', JSON.stringify(context));
    }
  };

  const handleGenerate = async (formData: MissionFormData) => {
    if (!duo) return;
    setIsLoading(true);
    setError(null);
    try {
      const request: MissionRequest = { ...formData, duo };
      const result = await generateMission(request);
      setMission(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("Le flux de l'encre est interrompu... Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = (imageUrl: string) => {
    if (!mission || !duo) return;
    const newMemory: Memory = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      title: mission.titre_episode,
      imageUrl,
      phase: duo.currentPhase
    };
    
    const phases = [GamePhase.PHASE_1, GamePhase.PHASE_2, GamePhase.PHASE_3, GamePhase.PHASE_4];
    const currentIndex = phases.indexOf(duo.currentPhase);
    const nextPhase = phases[Math.min(currentIndex + 1, phases.length - 1)];
    
    const updatedDuo = { ...duo, currentPhase: nextPhase };
    setDuo(updatedDuo);
    localStorage.setItem('prologue_duo', JSON.stringify(updatedDuo));

    const updatedMemories = [newMemory, ...memories];
    setMemories(updatedMemories);
    localStorage.setItem('prologue_memories', JSON.stringify(updatedMemories));
    
    setIsScanning(false);
    setMission(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center space-y-8 p-10 text-center">
        <div className="w-16 h-16 border-t-2 border-purple-500 rounded-full animate-spin"></div>
        <div className="space-y-2">
          <p className="font-header text-xl tracking-[0.3em] text-white">L'ENCRIER RÉFLÉCHIT</p>
          <p className="font-serif-elegant italic text-white/40 text-lg">"Le destin est en train d'être calligraphié..."</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white pb-20 pt-16 bg-[#050505]">
      {duo && <PartnerStatus duo={duo} onShare={() => setShowShare(true)} />}

      <header className="py-12 px-6 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-header tracking-[0.4em] text-center mb-4 animate-float ink-gradient">PROLOGUE</h1>
        <div className="h-[1px] w-24 bg-white/10 mb-4"></div>
        <p className="text-white/20 font-serif-elegant italic text-sm tracking-[0.2em] uppercase text-center">
          {duo ? duo.duoName : pendingDuo ? `Alliance ${pendingDuo.duoName}` : "Écrivez votre propre légende"}
        </p>
      </header>

      {duo && !mission && !showShare && <Roadmap currentPhase={duo.currentPhase} />}

      <main className="flex-grow px-4 max-w-7xl mx-auto w-full">
        {!duo && !showShare && !pendingDuo ? (
          <DuoSetup onComplete={handleDuoComplete} />
        ) : pendingDuo && !showShare && !duo ? (
          <DuoSetup onComplete={handleDuoComplete} initialData={pendingDuo} />
        ) : showShare ? (
          <ShareInvite duo={pendingDuo || duo!} onContinue={() => setShowShare(false)} />
        ) : !mission ? (
          <div className="animate-fade-in space-y-16">
            <MissionForm onGenerate={handleGenerate} isLoading={isLoading} />
            {error && (
              <div className="p-6 glass border-red-500/20 text-red-400 rounded-3xl text-center max-w-md mx-auto font-bold text-[10px] tracking-widest uppercase">
                {error}
              </div>
            )}
            <MemoryGallery memories={memories} />
          </div>
        ) : (
          <MissionResult 
            mission={mission!} 
            p1={duo!.p1}
            p2={duo!.p2}
            onReset={() => setMission(null)} 
            onCapture={() => setIsScanning(true)}
          />
        )}
      </main>

      {isScanning && (
        <MemoryScanner onCapture={handleCapture} onCancel={() => setIsScanning(false)} />
      )}
    </div>
  );
};

// Fixed the import error in index.tsx by adding the default export
export default App;
