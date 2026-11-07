import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, CheckCircle2, ChevronRight, Award, Compass, Search, Flame, Key, ShieldCheck } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';

interface HallwayProps {
  completedDoors: number[];
  onOpenDoor: (doorNumber: number) => void;
  onOpenPainting: () => void;
  onOpenSecretSeal: () => void;
  onChandelierTap: () => void;
  chandelierSwingCount: number;
}

interface DoorConfig {
  number: number;
  title: string;
  tagline: string;
  icon: 'sparkles' | 'award' | 'search' | 'compass' | 'crown';
  accentColor: string;
}

const DOORS: DoorConfig[] = [
  {
    number: 1,
    title: 'The Scratch Room',
    tagline: 'Scratch 3 cards to unveil what the world sees in you.',
    icon: 'sparkles',
    accentColor: '#00F0FF',
  },
  {
    number: 2,
    title: 'The Quiz Room',
    tagline: '5 witty dilemmas on tech, gym, and life.',
    icon: 'award',
    accentColor: '#38BDF8',
  },
  {
    number: 3,
    title: 'The Treasure Hunt',
    tagline: 'Locate 3 hidden artifacts of discipline in the navy study.',
    icon: 'search',
    accentColor: '#0EA5E9',
  },
  {
    number: 4,
    title: 'The Wheel of Fate',
    tagline: 'Spin the celestial wheel for prophecies of your trajectory.',
    icon: 'compass',
    accentColor: '#F59E0B',
  },
  {
    number: 5,
    title: 'The Final Door',
    tagline: 'The grand chamber. Requires unlocking Doors 1 through 4.',
    icon: 'crown',
    accentColor: '#FCD34D',
  },
];

export const Hallway: React.FC<HallwayProps> = ({
  completedDoors,
  onOpenDoor,
  onOpenPainting,
  onOpenSecretSeal,
  onChandelierTap,
  chandelierSwingCount,
}) => {
  const [paintingTilted, setPaintingTilted] = useState(false);
  const [lockedDoorShaking, setLockedDoorShaking] = useState(false);

  const isDoor5Unlocked = [1, 2, 3, 4].every((d) => completedDoors.includes(d));

  const handleDoorClick = (doorNumber: number) => {
    if (doorNumber === 5 && !isDoor5Unlocked) {
      sound.playClick();
      triggerHaptic([50, 50]);
      setLockedDoorShaking(true);
      setTimeout(() => setLockedDoorShaking(false), 600);
      return;
    }

    sound.playDoorOpen();
    triggerHaptic([60, 40, 100]);
    onOpenDoor(doorNumber);
  };

  const handlePaintingClick = () => {
    sound.playEasterEgg();
    triggerHaptic([60]);
    setPaintingTilted(true);
    setTimeout(() => {
      onOpenPainting();
      setPaintingTilted(false);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Grand Chandelier Easter Egg Area */}
      <div className="relative w-full flex justify-center -mt-2 mb-4">
        <button
          onClick={() => {
            sound.playChandelier();
            triggerHaptic([30, 20]);
            onChandelierTap();
          }}
          className={`group flex flex-col items-center cursor-pointer p-2 rounded-2xl hover:bg-cyan-500/10 transition-all ${
            chandelierSwingCount > 0 ? 'animate-swing' : ''
          }`}
          title="The Grand Mansion Chandelier (Tap me)"
          aria-label="Grand Chandelier"
        >
          {/* Ceiling mount cord */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-400 via-amber-400 to-amber-300" />
          {/* Ornate Chandelier fixture */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-7 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 border border-amber-300/60 shadow-lg glow-gold flex items-center justify-around px-2">
              <span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-pulse shadow-sm" />
              <span className="w-2 h-4 bg-amber-200 rounded-full animate-pulse shadow-sm" />
              <span className="w-2 h-4 bg-white rounded-full animate-pulse shadow-sm" />
              <span className="w-2 h-4 bg-amber-200 rounded-full animate-pulse shadow-sm" />
              <span className="w-1.5 h-3 bg-cyan-300 rounded-full animate-pulse shadow-sm" />
            </div>
            {/* Crystal drops */}
            <div className="absolute -bottom-3 flex gap-2">
              <span className="w-1 h-3 bg-cyan-200/90 rounded-b shadow" />
              <span className="w-1.5 h-4 bg-amber-100 rounded-b shadow" />
              <span className="w-1 h-3 bg-cyan-200/90 rounded-b shadow" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/60 opacity-0 group-hover:opacity-100 transition-opacity mt-4">
            Tap chandelier {chandelierSwingCount > 0 ? `(${chandelierSwingCount}/5)` : ''}
          </span>
        </button>
      </div>

      {/* Cinematic Intro Line (Prompt strict requirement) */}
      <div className="text-center mb-8 max-w-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-display text-glow-cyan">
          The Hallway of Secrets
        </h2>
        <p className="text-base sm:text-lg text-cyan-200 font-medium tracking-wide">
          "Five doors. Each hides something for you."
        </p>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Doors 1 through 4 open in any order · Complete them to unlock Door 5
        </p>
      </div>

      {/* Hallway Perspective Scene */}
      <div className="w-full relative rounded-3xl p-4 sm:p-8 mansion-glass border border-cyan-500/25 shadow-2xl mb-8 overflow-hidden bg-gradient-to-b from-[#050B1F] via-[#091B42] to-[#040817]">
        {/* Architectural Pillars & Light sconces */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-0 left-12 w-12 h-full border-r border-cyan-400/30" />
          <div className="absolute top-0 right-12 w-12 h-full border-l border-cyan-400/30" />
          {/* Ceiling Arch Lines */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-32 rounded-full border border-cyan-400/20" />
        </div>

        {/* The Mysterious Hallway Oil Painting (Secret Room trigger) */}
        <div className="w-full flex justify-center mb-8 relative z-10">
          <button
            onClick={handlePaintingClick}
            className={`group relative p-2 rounded-2xl bg-slate-950/80 border-2 border-amber-400/60 shadow-xl glow-gold transition-transform duration-300 ${
              paintingTilted ? 'rotate-6 scale-95' : 'hover:scale-102 hover:-rotate-1'
            }`}
            title="Inspect the Oil Painting"
            aria-label="Hallway Oil Painting"
          >
            <div className="w-48 sm:w-60 h-28 sm:h-32 rounded-xl bg-gradient-to-tr from-[#050B1F] via-[#0B2559] to-[#050B1F] border border-cyan-400/30 p-3 flex flex-col justify-between overflow-hidden relative">
              {/* Painting illustration of mansion under night sky */}
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                <span>MANSION BLUEPRINT</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              <div className="flex flex-col items-center justify-center my-auto">
                <div className="w-10 h-10 rounded-full border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Compass className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-[10px] text-cyan-200 mt-1 font-mono tracking-wider">
                  Tap to Inspect Frame
                </span>
              </div>
              <div className="h-0.5 w-full bg-cyan-500/20" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-400/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Secret mechanism behind painting
            </span>
          </button>
        </div>

        {/* Doors 1 to 4 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
          {DOORS.slice(0, 4).map((door) => {
            const isCompleted = completedDoors.includes(door.number);

            return (
              <div
                key={door.number}
                onClick={() => handleDoorClick(door.number)}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[200px] shadow-lg active:scale-98 ${
                  isCompleted
                    ? 'mansion-glass-gold border-amber-400/50 hover:border-amber-300 glow-gold'
                    : 'mansion-glass border-cyan-500/30 hover:border-cyan-400 glow-cyan hover:scale-[1.02]'
                }`}
              >
                {/* Top Door Label & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400">
                    DOOR 0{door.number}
                  </span>

                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>DONE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/30">
                      <Unlock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>OPEN</span>
                    </div>
                  )}
                </div>

                {/* Door Graphic Visual Arch */}
                <div className="my-2 py-3 px-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-950/40 transition-colors">
                  <div className="w-12 h-16 rounded-t-xl border-2 border-cyan-400/50 flex flex-col items-center justify-center relative shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-amber-400 absolute right-2 top-8 shadow" />
                    {door.number === 1 && <Sparkles className="w-5 h-5 text-cyan-300" />}
                    {door.number === 2 && <Award className="w-5 h-5 text-amber-300" />}
                    {door.number === 3 && <Search className="w-5 h-5 text-cyan-300" />}
                    {door.number === 4 && <Compass className="w-5 h-5 text-amber-300" />}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-display group-hover:text-cyan-200 transition-colors">
                    {door.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {door.tagline}
                  </p>
                </div>

                {/* Enter Button CTA */}
                <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-xs font-semibold text-cyan-300 group-hover:text-white transition-colors">
                  <span>{isCompleted ? 'Revisit Chamber' : 'Enter Chamber'}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Door 5: The Grand Final Door */}
        <div className="w-full relative z-10 pt-2">
          {(() => {
            const door5 = DOORS[4];
            const isCompleted = completedDoors.includes(5);

            return (
              <div
                onClick={() => handleDoorClick(5)}
                className={`relative rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  isDoor5Unlocked
                    ? 'mansion-glass-gold border-amber-400/70 hover:border-amber-300 glow-gold-lg hover:scale-[1.01]'
                    : `bg-slate-950/80 border-slate-700/60 opacity-85 hover:border-cyan-500/30 ${
                        lockedDoorShaking ? 'animate-shake' : ''
                      }`
                }`}
              >
                {/* Left side: Grand Lock Graphic */}
                <div className="flex items-center gap-5">
                  <div
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex items-center justify-center border-2 transition-all shrink-0 ${
                      isDoor5Unlocked
                        ? 'bg-amber-500/20 border-amber-400 glow-gold'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {isDoor5Unlocked ? (
                      <Unlock className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse" />
                    ) : (
                      <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold tracking-widest text-amber-400">
                        DOOR 05 · GRAND FINALE
                      </span>
                      {isDoor5Unlocked && (
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          {isCompleted ? 'COMPLETED' : 'UNLOCKED & READY'}
                        </span>
                      )}
                      {!isDoor5Unlocked && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                          LOCKED (4 SEALS NEEDED)
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mb-1">
                      The Final Sanctuary
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                      {isDoor5Unlocked
                        ? 'The seals are broken. Step through to receive your tribute and the secret master key.'
                        : `Unlock Doors 1, 2, 3, and 4 first. Current seals broken: ${
                            completedDoors.filter((d) => d < 5).length
                          } of 4.`}
                    </p>
                  </div>
                </div>

                {/* Right side CTA Button */}
                <div className="w-full sm:w-auto shrink-0">
                  <button
                    className={`w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      isDoor5Unlocked
                        ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span>{isDoor5Unlocked ? 'Open The Final Door' : 'Door Sealed'}</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Secret Clandestine Button / Seal in the bottom corner (Easter Egg 3) */}
      <div className="w-full flex justify-end pr-2">
        <button
          onClick={() => {
            sound.playEasterEgg();
            triggerHaptic([50, 50, 100]);
            onOpenSecretSeal();
          }}
          className="group p-2 rounded-xl text-slate-600 hover:text-amber-400 transition-colors opacity-60 hover:opacity-100 flex items-center gap-1.5 cursor-pointer"
          title="Faint glowing seal"
          aria-label="Secret Corner Seal"
        >
          <Flame className="w-4 h-4 text-cyan-400/40 group-hover:text-amber-400 transition-colors" />
          <span className="text-[10px] font-mono text-cyan-400/30 group-hover:text-amber-300 transition-colors">
            Crest 23
          </span>
        </button>
      </div>
    </div>
  );
};
