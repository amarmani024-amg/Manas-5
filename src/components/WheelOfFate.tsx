import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, RotateCw, Sparkles, Star } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireMansionConfetti } from '../utils/confetti';

interface WheelOfFateProps {
  onBack: () => void;
  onComplete: () => void;
  isAlreadyCompleted: boolean;
}

interface Fortune {
  id: number;
  label: string;
  prediction: string;
  color: string;
}

const FORTUNES: Fortune[] = [
  {
    id: 1,
    label: 'Clean Code',
    prediction: 'Your next major system will compile on the first try with 0 warnings and pure elegance.',
    color: '#06B6D4',
  },
  {
    id: 2,
    label: 'Standing Ovation',
    prediction: 'Your pull request will be approved in record time with praise from senior staff.',
    color: '#3B82F6',
  },
  {
    id: 3,
    label: 'Gym Breakthrough',
    prediction: 'A new personal best in the gym will be conquered with flawless form and zero next-day soreness.',
    color: '#F59E0B',
  },
  {
    id: 4,
    label: 'Master Architect',
    prediction: 'You will architect an innovative solution that unblocks an entire engineering milestone.',
    color: '#10B981',
  },
  {
    id: 5,
    label: 'Ironclad Alliances',
    prediction: 'Your genuine loyalty and reliability will surround you with the highest caliber collaborators.',
    color: '#8B5CF6',
  },
  {
    id: 6,
    label: 'High-Stakes Calm',
    prediction: 'When chaos strikes elsewhere, your calm demeanor will steady the room and guide the solution.',
    color: '#0EA5E9',
  },
  {
    id: 7,
    label: 'Exponential Returns',
    prediction: 'The quiet discipline you invest today will compound into extraordinary milestones in your 20s.',
    color: '#F59E0B',
  },
  {
    id: 8,
    label: 'Clarity of Vision',
    prediction: 'A moment of pure insight will unlock the exact blueprint for your next ambitious dream.',
    color: '#14B8A6',
  },
];

export const WheelOfFate: React.FC<WheelOfFateProps> = ({
  onBack,
  onComplete,
  isAlreadyCompleted,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFortune, setSelectedFortune] = useState<Fortune | null>(
    isAlreadyCompleted ? FORTUNES[0] : null
  );
  const [spinsCount, setSpinsCount] = useState(isAlreadyCompleted ? 1 : 0);
  const lastTickAngle = useRef(0);

  const numSlices = FORTUNES.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;

    sound.playClick();
    triggerHaptic([40]);
    setIsSpinning(true);
    setSelectedFortune(null);

    // Random landing segment (3 to 6 full rotations + segment offset)
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalExtra = 360 * 5 + extraDegrees;
    const targetRotation = rotation + totalExtra;

    // Tick audio as wheel turns
    const startTime = performance.now();
    const duration = 4000;
    const startAngle = rotation;

    const tickInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= duration) {
        clearInterval(tickInterval);
        return;
      }
      // Ease out cubic
      const progress = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentDeg = startAngle + totalExtra * easeOut;

      if (Math.abs(currentDeg - lastTickAngle.current) >= sliceAngle) {
        sound.playWheelTick();
        lastTickAngle.current = currentDeg;
      }
    }, 45);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Top pointer is at 270 deg (or 90 deg relative to canvas top)
      const normalizedDeg = (360 - (targetRotation % 360)) % 360;
      const index = Math.floor(normalizedDeg / sliceAngle) % numSlices;
      const landed = FORTUNES[index];

      setSelectedFortune(landed);
      setSpinsCount((c) => c + 1);
      sound.playSuccess();
      triggerHaptic([80, 40, 120]);
      fireMansionConfetti();
      onComplete();
    }, duration);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
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

        <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono">
          Door 04 · Wheel of Fate
        </span>
      </div>

      {/* Mandatory One-Line Instruction */}
      <div className="w-full text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-display">
          The Prophecies of Trajectory
        </h2>
        <p className="text-sm sm:text-base text-cyan-200/90 font-medium bg-cyan-950/40 py-2.5 px-4 rounded-xl border border-cyan-500/20 max-w-xl mx-auto shadow-inner">
          Spin the wheel for positive predictions about your bright future.
        </p>
      </div>

      {/* The Wheel Container */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4 flex items-center justify-center">
        {/* Glow backdrop ring */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />

        {/* Outer ornate border */}
        <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/30 p-1 pointer-events-none">
          <div className="w-full h-full rounded-full border border-amber-400/30" />
        </div>

        {/* Top Pointer Needle */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-4 h-7 bg-gradient-to-b from-amber-300 to-amber-500 clip-triangle shadow-lg shadow-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-white -mt-1 shadow" />
        </div>

        {/* Rotating SVG Wheel */}
        <div
          className="w-full h-full rounded-full shadow-2xl relative transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? '4000ms' : '0ms',
            transitionTimingFunction: 'cubic-bezier(0.15, 0.95, 0.35, 1)',
          }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full rounded-full overflow-hidden">
            {FORTUNES.map((fortune, i) => {
              const startAngleRad = (i * sliceAngle * Math.PI) / 180;
              const endAngleRad = ((i + 1) * sliceAngle * Math.PI) / 180;
              const x1 = 150 + 150 * Math.cos(startAngleRad);
              const y1 = 150 + 150 * Math.sin(startAngleRad);
              const x2 = 150 + 150 * Math.cos(endAngleRad);
              const y2 = 150 + 150 * Math.sin(endAngleRad);

              const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`;
              const midAngle = i * sliceAngle + sliceAngle / 2;

              return (
                <g key={fortune.id}>
                  <path
                    d={pathData}
                    fill={i % 2 === 0 ? '#0B1F4D' : '#071536'}
                    stroke="rgba(0, 240, 255, 0.25)"
                    strokeWidth="1.5"
                  />
                  {/* Slice Text */}
                  <text
                    x="150"
                    y="50"
                    transform={`rotate(${midAngle + 90}, 150, 150)`}
                    fill="#F0F6FC"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans"
                    textAnchor="middle"
                    className="select-none tracking-tight"
                  >
                    {fortune.label}
                  </text>
                </g>
              );
            })}
            {/* Center Hub */}
            <circle cx="150" cy="150" r="34" fill="#050B1F" stroke="#00F0FF" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="28" fill="#0A1E4A" />
          </svg>
        </div>

        {/* Center Spin Button / Icon */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center border-2 border-cyan-300 shadow-lg shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isSpinning ? <RotateCw className="w-6 h-6 animate-spin text-white" /> : 'SPIN'}
        </button>
      </div>

      {/* Primary Big Action Button */}
      <div className="w-full max-w-sm mt-4 mb-6">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full min-h-[52px] px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{isSpinning ? 'Consulting the Spheres...' : 'Spin The Wheel of Fate'}</span>
        </button>
      </div>

      {/* Selected Prediction Card */}
      {selectedFortune && (
        <div className="w-full mansion-glass-gold rounded-2xl p-6 border border-amber-400/40 shadow-2xl text-center flex flex-col items-center mb-6 animate-fade-in">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono uppercase mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Prophecy Unlocked</span>
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>

          <h4 className="text-xl font-bold text-white mb-2 font-display">
            {selectedFortune.label}
          </h4>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md italic mb-4">
            "{selectedFortune.prediction}"
          </p>

          <p className="text-xs text-cyan-300 font-mono">
            Destined for achievement · Total Spins: {spinsCount}
          </p>
        </div>
      )}

      {/* Return or Skip Control */}
      {spinsCount > 0 && (
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-cyan-950/80 border border-cyan-400/30 text-cyan-200 font-semibold text-sm hover:text-white hover:border-cyan-400 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span>Room Completed · Continue Hallway</span>
        </button>
      )}
    </div>
  );
};
