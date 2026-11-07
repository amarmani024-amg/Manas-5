import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Search, Lightbulb, Sparkles, Scroll, Compass, Dumbbell } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireMansionConfetti } from '../utils/confetti';

interface TreasureHuntRoomProps {
  onBack: () => void;
  onComplete: () => void;
  isAlreadyCompleted: boolean;
}

interface Artifact {
  id: string;
  name: string;
  description: string;
  xPercent: number; // position on room canvas
  yPercent: number;
  icon: 'scroll' | 'dumbbell' | 'compass';
}

const ARTIFACTS: Artifact[] = [
  {
    id: 'blueprint',
    name: 'The Blueprint of Precision',
    description: 'An architectural schematic symbolizing deep focus and engineering mastery.',
    xPercent: 24,
    yPercent: 62,
    icon: 'scroll',
  },
  {
    id: 'dumbbell',
    name: 'The Dumbbell of Relentless Discipline',
    description: 'A solid cast dumbbell representing daily consistency, strength, and quiet grit.',
    xPercent: 78,
    yPercent: 74,
    icon: 'dumbbell',
  },
  {
    id: 'compass',
    name: 'The Compass of Integrity',
    description: 'A golden maritime compass representing moral direction, loyalty, and steadfast truth.',
    xPercent: 54,
    yPercent: 35,
    icon: 'compass',
  },
];

export const TreasureHuntRoom: React.FC<TreasureHuntRoomProps> = ({
  onBack,
  onComplete,
  isAlreadyCompleted,
}) => {
  const [found, setFound] = useState<string[]>(
    isAlreadyCompleted ? ['blueprint', 'dumbbell', 'compass'] : []
  );
  const [activeHint, setActiveHint] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lastDiscovered, setLastDiscovered] = useState<Artifact | null>(null);

  // Auto-reveal hints after 15 seconds
  useEffect(() => {
    if (found.length === ARTIFACTS.length) return;
    const interval = setInterval(() => {
      setTimerSeconds((t) => {
        if (t + 1 >= 15) {
          setActiveHint(true);
        }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [found.length]);

  const handleTapArtifact = (artifact: Artifact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (found.includes(artifact.id)) return;

    sound.playSuccess();
    triggerHaptic([70, 30, 90]);
    const nextFound = [...found, artifact.id];
    setFound(nextFound);
    setLastDiscovered(artifact);

    if (nextFound.length === ARTIFACTS.length) {
      fireMansionConfetti();
      onComplete();
    }
  };

  const handleRoomClick = () => {
    // Register miss
    setMisses((m) => m + 1);
    sound.playClick();
  };

  const handleSkipOrCollectAll = () => {
    sound.playSuccess();
    triggerHaptic([100, 50, 150]);
    fireMansionConfetti();
    setFound(['blueprint', 'dumbbell', 'compass']);
    onComplete();
  };

  const allFound = found.length === ARTIFACTS.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center select-none">
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
          Door 03 · Treasure Hunt
        </span>
      </div>

      {/* Mandatory One-Line Instruction */}
      <div className="w-full text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-display">
          The Navy Observatory
        </h2>
        <p className="text-sm sm:text-base text-cyan-200/90 font-medium bg-cyan-950/40 py-2.5 px-4 rounded-xl border border-cyan-500/20 max-w-xl mx-auto shadow-inner">
          Find 3 hidden objects in the navy chamber.
        </p>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          {ARTIFACTS.map((item) => {
            const isCollected = found.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isCollected
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                    : 'bg-slate-900/60 border-cyan-500/20 text-slate-400'
                }`}
              >
                {isCollected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Search className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="hidden sm:inline">{item.name}</span>
                <span className="sm:hidden">{item.icon}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveHint(true);
          }}
          className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
            activeHint
              ? 'bg-amber-500/25 border-amber-400 text-amber-200'
              : 'mansion-glass text-cyan-300 hover:text-white border-cyan-500/30'
          }`}
        >
          <Lightbulb className={`w-3.5 h-3.5 ${activeHint ? 'text-amber-300 animate-bounce' : ''}`} />
          <span>{activeHint ? 'Hints Active' : timerSeconds >= 15 ? 'Auto-Hint Ready' : `Hint in ${15 - timerSeconds}s`}</span>
        </button>
      </div>

      {/* Interactive Room Scene */}
      <div
        onClick={handleRoomClick}
        className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-gradient-to-b from-[#050B1F] via-[#091A3E] to-[#04091A] cursor-crosshair mb-6 group"
      >
        {/* Architectural backdrop elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Arched windows */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-36 border-2 border-cyan-400/30 rounded-t-full bg-cyan-950/20 backdrop-blur-sm" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-28 border border-cyan-300/20 rounded-t-full" />
          {/* Starlight beams through window */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-52 bg-gradient-to-b from-cyan-400/15 via-transparent to-transparent rotate-12 blur-md" />

          {/* Bookshelf on left */}
          <div className="absolute top-16 left-4 w-32 h-64 border border-cyan-500/20 bg-slate-950/40 rounded-lg p-2 flex flex-col justify-between">
            <div className="w-full h-1 bg-cyan-500/20" />
            <div className="w-full h-1 bg-cyan-500/20" />
            <div className="w-full h-1 bg-cyan-500/20" />
            <div className="w-full h-1 bg-cyan-500/20" />
          </div>

          {/* Lounge Bench on right */}
          <div className="absolute bottom-6 right-6 w-44 h-16 border border-cyan-500/25 bg-blue-950/30 rounded-xl" />

          {/* Study desk in center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 h-20 border border-cyan-400/20 bg-slate-900/50 rounded-t-xl" />
        </div>

        {/* Ambient star dust particles */}
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse opacity-70 pointer-events-none" />

        {/* Artifact 1: Blueprint */}
        <button
          onClick={(e) => handleTapArtifact(ARTIFACTS[0], e)}
          style={{ left: `${ARTIFACTS[0].xPercent}%`, top: `${ARTIFACTS[0].yPercent}%` }}
          aria-label="The Blueprint of Precision"
          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center transition-all ${
            found.includes('blueprint')
              ? 'opacity-40 grayscale pointer-events-none'
              : activeHint
              ? 'animate-bounce glow-gold bg-amber-500/40 border-2 border-amber-300'
              : 'hover:scale-125 bg-cyan-950/60 border border-cyan-400/40 hover:border-cyan-300'
          }`}
        >
          <Scroll className={`w-6 h-6 ${found.includes('blueprint') ? 'text-slate-500' : 'text-amber-300'}`} />
          {activeHint && !found.includes('blueprint') && (
            <span className="absolute -top-7 text-[10px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-400/50 whitespace-nowrap">
              Blueprint
            </span>
          )}
        </button>

        {/* Artifact 2: Dumbbell */}
        <button
          onClick={(e) => handleTapArtifact(ARTIFACTS[1], e)}
          style={{ left: `${ARTIFACTS[1].xPercent}%`, top: `${ARTIFACTS[1].yPercent}%` }}
          aria-label="The Dumbbell of Relentless Discipline"
          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center transition-all ${
            found.includes('dumbbell')
              ? 'opacity-40 grayscale pointer-events-none'
              : activeHint
              ? 'animate-bounce glow-cyan bg-cyan-500/40 border-2 border-cyan-300'
              : 'hover:scale-125 bg-blue-950/60 border border-cyan-400/40 hover:border-cyan-300'
          }`}
        >
          <Dumbbell className={`w-6 h-6 ${found.includes('dumbbell') ? 'text-slate-500' : 'text-cyan-300'}`} />
          {activeHint && !found.includes('dumbbell') && (
            <span className="absolute -top-7 text-[10px] font-mono text-cyan-300 bg-black/80 px-2 py-0.5 rounded border border-cyan-400/50 whitespace-nowrap">
              Dumbbell
            </span>
          )}
        </button>

        {/* Artifact 3: Compass */}
        <button
          onClick={(e) => handleTapArtifact(ARTIFACTS[2], e)}
          style={{ left: `${ARTIFACTS[2].xPercent}%`, top: `${ARTIFACTS[2].yPercent}%` }}
          aria-label="The Compass of Integrity"
          className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-full min-h-[48px] min-w-[48px] flex items-center justify-center transition-all ${
            found.includes('compass')
              ? 'opacity-40 grayscale pointer-events-none'
              : activeHint
              ? 'animate-bounce glow-gold bg-amber-500/40 border-2 border-amber-300'
              : 'hover:scale-125 bg-slate-900/60 border border-amber-400/40 hover:border-amber-300'
          }`}
        >
          <Compass className={`w-6 h-6 ${found.includes('compass') ? 'text-slate-500' : 'text-amber-300'}`} />
          {activeHint && !found.includes('compass') && (
            <span className="absolute -top-7 text-[10px] font-mono text-amber-300 bg-black/80 px-2 py-0.5 rounded border border-amber-400/50 whitespace-nowrap">
              Compass
            </span>
          )}
        </button>
      </div>

      {/* Discovered Item Detail Toast */}
      {lastDiscovered && (
        <div className="w-full max-w-xl p-4 rounded-xl mansion-glass border border-amber-400/30 mb-6 flex items-start gap-3 animate-fade-in shadow-xl">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white font-display">{lastDiscovered.name} Discovered</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{lastDiscovered.description}</p>
          </div>
        </div>
      )}

      {/* Bottom Controls / Skip */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
        {!allFound && (
          <button
            onClick={handleSkipOrCollectAll}
            className="w-full sm:w-auto min-h-[48px] px-6 py-2.5 rounded-xl mansion-glass text-cyan-300 hover:text-white border-cyan-500/25 transition-all text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{misses >= 2 ? 'Skip & Collect All (Unlocked)' : 'Auto-Collect Artifacts'}</span>
          </button>
        )}

        {allFound && (
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Room Complete · Return to Hallway</span>
          </button>
        )}
      </div>
    </div>
  );
};
