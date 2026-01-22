
import React, { useRef, useState, useEffect } from 'react';

interface MemoryScannerProps {
  onCapture: (imageUrl: string) => void;
  onCancel: () => void;
}

export const MemoryScanner: React.FC<MemoryScannerProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[3/4] bg-slate-900 rounded-lg overflow-hidden relative border-4 border-slate-800 shadow-2xl">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/20 flex items-center justify-center">
          <div className="w-48 h-48 border border-white/30 rounded-full opacity-50"></div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-8 flex flex-col items-center space-y-6 w-full max-w-xs">
        <h2 className="font-header text-sm tracking-[0.3em] text-white uppercase text-center">Capturez la trace physique</h2>
        <button
          onClick={takePhoto}
          className="w-20 h-20 bg-white rounded-full border-8 border-slate-300 shadow-xl active:scale-90 transition-transform"
        ></button>
        <button
          onClick={onCancel}
          className="text-slate-400 uppercase font-header text-xs tracking-widest hover:text-white transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};
