import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Sparkles, Key, RotateCcw, Copy, Check, Crown, ShieldCheck } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireGrandFinaleConfetti, fireShower } from '../utils/confetti';

interface FinalRoomProps {
  onBack: () => void;
  onReplay: () => void;
}

export const FinalRoom: React.FC<FinalRoomProps> = ({ onBack, onReplay }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [chestOpened, setChestOpened] = useState(true);

  // Trigger grand fireworks and sound on mount
  useEffect(() => {
    sound.playGrandFanfare();
    triggerHaptic([100, 50, 100, 50, 200]);
    fireGrandFinaleConfetti();

    // Canvas navy and silver fireworks
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = [
      '#FFFFFF', // pure silver white
      '#CBD5E1', // silver slate
      '#94A3B8', // metallic silver
      '#38BDF8', // ice cyan
      '#00F0FF', // electric cyan
      '#FCD34D', // soft gold
      '#1E3A8A', // deep royal navy
    ];

    const createBurst = (x: number, y: number) => {
      const count = 45;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1.5 + Math.random() * 2.5,
          decay: 0.012 + Math.random() * 0.015,
        });
      }
    };

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (tick % 35 === 0) {
        createBurst(
          canvas.width * (0.15 + Math.random() * 0.7),
          canvas.height * (0.15 + Math.random() * 0.45)
        );
      }
      tick++;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleCopyCode = () => {
    sound.playClick();
    triggerHaptic([50]);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('SURPRISEKING').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerMoreConfetti = () => {
    sound.playSuccess();
    triggerHaptic([80, 40, 100]);
    fireShower();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Background Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="min-h-[44px] min-w-[44px] px-4 py-2 flex items-center gap-2 rounded-xl mansion-glass text-cyan-300 hover:text-white transition-all active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Hallway</span>
        </button>

        <span className="text-xs uppercase tracking-widest text-amber-400 font-mono flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-400" />
          The Final Chamber
        </span>
      </div>

      {/* Giant Glowing "S" Insignia */}
      <div className="relative my-4 flex items-center justify-center z-10">
        <div className="absolute w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none animate-pulse-slow" />
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl mansion-glass border-2 border-cyan-400/60 flex items-center justify-center shadow-2xl glow-cyan-lg">
          <span className="text-6xl sm:text-7xl font-extrabold font-display bg-gradient-to-br from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent text-glow-cyan select-none">
            S
          </span>
        </div>
      </div>

      {/* Cinematic Main Title */}
      <div className="text-center mb-6 z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>ALL FIVE SEALS UNLOCKED</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-display">
          A Message for You
        </h2>
        <p className="text-xs sm:text-sm text-cyan-300/80 font-mono">
          Engineered with deep respect, genuine warmth, and quiet awe.
        </p>
      </div>

      {/* The Sincere Appreciation Card */}
      <div className="w-full mansion-glass rounded-2xl p-6 sm:p-8 border border-cyan-400/30 shadow-2xl mb-6 z-10 space-y-4 text-left">
        <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
          At twenty-three, you already embody qualities that many spend a lifetime trying to cultivate.
        </p>

        <div className="space-y-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          <p>
            Your intellect is clear and sharp—you don’t merely solve complex problems, you make them look simple. But far beyond raw brilliance, what stands out most is your character: unwavering discipline in your work and training, steadfast loyalty to the people around you, and a mature calm that never wavers under pressure.
          </p>

          <p>
            You are always the first to offer a helpful hand, yet the last to ask for applause. That blend of humility, boundless curiosity, and ironclad integrity is truly exceptional.
          </p>

          <p className="text-cyan-200 font-medium">
            The road ahead of you is wide open, and there is no ceiling on what your focus and dedication will build. Keep backing yourself with the exact quiet confidence you carry every day.
          </p>
        </div>

        <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
          <span>CHARACTER · DISCIPLINE · BRILLIANCE</span>
          <span className="text-amber-400">RESPECT & WARMTH ALWAYS</span>
        </div>
      </div>

      {/* Gold Box with Secret Code */}
      <div className="w-full max-w-md mansion-glass-gold rounded-2xl p-6 border-2 border-amber-400/50 shadow-2xl z-10 text-center glow-gold mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-300">
            MANSION MASTER CODE
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </div>

        <div className="my-3 py-3 px-4 rounded-xl bg-slate-950/80 border border-amber-400/40 flex items-center justify-center gap-3">
          <Key className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-widest text-glow-gold">
            Secret Code: SURPRISEKING
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Code: SURPRISEKING'}</span>
        </button>
      </div>

      {/* Action Buttons: Confetti Shower & Replay */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 z-10">
        <button
          onClick={handleTriggerMoreConfetti}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Confetti Shower</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onReplay();
          }}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl mansion-glass text-cyan-200 hover:text-white border-cyan-400/30 text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-cyan-300" />
          <span>Replay Mansion</span>
        </button>
      </div>
    </div>
  );
};
