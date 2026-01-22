
import React from 'react';
import { Memory } from '../types';

interface MemoryGalleryProps {
  memories: Memory[];
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ memories }) => {
  if (memories.length === 0) return null;

  return (
    <section className="mt-20 px-6 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex items-center space-x-4">
        <div className="h-[1px] flex-grow bg-slate-900"></div>
        <h2 className="font-header text-xs tracking-[0.5em] text-slate-500 uppercase">La Constellation</h2>
        <div className="h-[1px] flex-grow bg-slate-900"></div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {memories.map((m) => (
          <div key={m.id} className="group relative aspect-square overflow-hidden bg-slate-900 rounded-sm border border-slate-800 hover:border-slate-600 transition-all">
            <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <span className="text-[8px] font-header tracking-widest text-slate-400 uppercase">{m.phase}</span>
              <p className="text-white font-serif-elegant text-sm italic">{m.title}</p>
              <p className="text-[8px] text-slate-500">{m.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
