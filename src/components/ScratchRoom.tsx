import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireMansionConfetti } from '../utils/confetti';

interface ScratchRoomProps {
  onBack: () => void;
  onComplete: () => void;
  isAlreadyCompleted: boolean;
}

interface CardData {
  id: number;
  tag: string;
  title: string;
  compliment: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    tag: 'INTELLECT & CLARITY',
    title: "The Architect's Mind",
    compliment:
      'Your clarity under complexity is rare. When problems get chaotic, your intellect makes the signal cut through the noise with calm precision.',
  },
  {
    id: 2,
    tag: 'CHARACTER & INTEGRITY',
    title: 'Unshakable Loyalty',
    compliment:
      'Your word is ironclad. In a noisy world of fair-weather talk, your steadfast reliability, maturity, and quiet strength stand tall.',
  },
  {
    id: 3,
    tag: 'DISCIPLINE & DRIVE',
    title: 'The Hopeful Builder',
    compliment:
      'You carry high ambition with grounded discipline and genuine kindness. Your focus in training and in engineering will take you anywhere you aim.',
  },
];

export const ScratchRoom: React.FC<ScratchRoomProps> = ({
  onBack,
  onComplete,
  isAlreadyCompleted,
}) => {
  const [scratchedState, setScratchedState] = useState<Record<number, boolean>>({
    1: isAlreadyCompleted,
    2: isAlreadyCompleted,
    3: isAlreadyCompleted,
  });

  const allRevealed = Object.values(scratchedState).every(Boolean);

  const handleCardComplete = (id: number) => {
    sound.playSuccess();
    triggerHaptic([60, 40, 100]);
    setScratchedState((prev) => {
      const next = { ...prev, [id]: true };
      if (Object.values(next).every(Boolean)) {
        fireMansionConfetti();
        onComplete();
      }
      return next;
    });
  };

  const handleRevealAll = () => {
    sound.playSuccess();
    triggerHaptic([100, 50, 150]);
    setScratchedState({ 1: true, 2: true, 3: true });
    fireMansionConfetti();
    onComplete();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Header & Instruction */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="min-h-[44px] min-w-[44px] px-4 py-2 flex items-center gap-2 rounded-xl mansion-glass text-cyan-300 hover:text-white hover:border-cyan-400 transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Hallway</span>
        </button>

        <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Door 01 · Scratch Room
        </span>
      </div>

      {/* Mandatory One-Line Instruction */}
      <div className="w-full text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-display">
          Reflections of Truth
        </h2>
        <p className="text-sm sm:text-base text-cyan-200/90 font-medium bg-cyan-950/40 py-2.5 px-4 rounded-xl border border-cyan-500/20 max-w-xl mx-auto shadow-inner">
          Scratch each card with your finger or mouse to reveal what's underneath.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {CARDS.map((card) => (
          <ScratchCardItem
            key={card.id}
            card={card}
            isRevealed={scratchedState[card.id]}
            onRevealed={() => handleCardComplete(card.id)}
          />
        ))}
      </div>

      {/* Controls & Skip / Reveal Option */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        {!allRevealed && (
          <button
            onClick={handleRevealAll}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl mansion-glass text-cyan-300 hover:text-white hover:border-cyan-400 transition-all font-medium text-sm flex items-center justify-center gap-2 active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>Instant Reveal (Skip Scratching)</span>
          </button>
        )}

        {allRevealed && (
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-98 transition-all"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-100" />
            <span>Room Completed · Continue Hallway</span>
          </button>
        )}
      </div>
    </div>
  );
};

interface ScratchCardItemProps {
  card: CardData;
  isRevealed: boolean;
  onRevealed: () => void;
}

const ScratchCardItem: React.FC<ScratchCardItemProps> = ({ card, isRevealed, onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const scratchedPixels = useRef(0);
  const totalPixels = useRef(1);
  const alreadyTriggered = useRef(isRevealed);

  useEffect(() => {
    if (isRevealed) {
      alreadyTriggered.current = true;
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 300);
    const height = (canvas.height = canvas.offsetHeight || 320);
    totalPixels.current = width * height;

    // Deep mysterious metallic navy scratch coat with subtle grid and gold flecks
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0d2047');
    grad.addColorStop(0.5, '#07142e');
    grad.addColorStop(1, '#0b2a63');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Architectural pattern
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 20; x < width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 20; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Gold decorative foil badge
    ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH TO REVEAL', width / 2, height / 2 - 12);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px sans-serif';
    ctx.fillText('Touch & drag across', width / 2, height / 2 + 12);
  }, [isRevealed]);

  const scratchAt = (x: number, y: number) => {
    if (isRevealed || alreadyTriggered.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();

    sound.playScratch();

    // Sample progress periodically
    scratchedPixels.current += 1;
    if (scratchedPixels.current % 12 === 0) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentCount = 0;
      for (let i = 3; i < imgData.data.length; i += 32) {
        if (imgData.data[i] === 0) transparentCount++;
      }
      const ratio = transparentCount / (imgData.data.length / 32);
      if (ratio > 0.42 && !alreadyTriggered.current) {
        alreadyTriggered.current = true;
        onRevealed();
      }
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden mansion-glass border border-cyan-500/25 flex flex-col justify-between p-6 shadow-xl shadow-black/40">
      {/* Revealed Content underneath */}
      <div className="flex flex-col h-full justify-between z-0">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
              {card.tag}
            </span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 font-display">
            {card.title}
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            "{card.compliment}"
          </p>
        </div>

        <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between text-xs text-cyan-300 font-mono">
          <span>AUTHENTIC & SINCERE</span>
          <span className="text-amber-400">VERIFIED</span>
        </div>
      </div>

      {/* Canvas scratch layer */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none transition-opacity duration-500"
          onMouseDown={(e) => {
            isDrawing.current = true;
            const { x, y } = getCoordinates(e);
            scratchAt(x, y);
          }}
          onMouseMove={(e) => {
            if (!isDrawing.current) return;
            const { x, y } = getCoordinates(e);
            scratchAt(x, y);
          }}
          onMouseUp={() => {
            isDrawing.current = false;
          }}
          onMouseLeave={() => {
            isDrawing.current = false;
          }}
          onTouchStart={(e) => {
            isDrawing.current = true;
            const { x, y } = getCoordinates(e);
            scratchAt(x, y);
          }}
          onTouchMove={(e) => {
            if (!isDrawing.current) return;
            const { x, y } = getCoordinates(e);
            scratchAt(x, y);
          }}
          onTouchEnd={() => {
            isDrawing.current = false;
          }}
        />
      )}
    </div>
  );
};
