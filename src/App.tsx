import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Award, Sparkles, Smartphone, Terminal, HelpCircle, CheckCircle2 } from 'lucide-react';
import { sound, triggerHaptic } from './utils/audio';
import { fireShower, fireMansionConfetti } from './utils/confetti';
import { loadMansionState, saveMansionState, resetMansionStorage, MansionState, ALL_ACHIEVEMENTS } from './utils/storage';
import { Hallway } from './components/Hallway';
import { ScratchRoom } from './components/ScratchRoom';
import { QuizRoom } from './components/QuizRoom';
import { TreasureHuntRoom } from './components/TreasureHuntRoom';
import { WheelOfFate } from './components/WheelOfFate';
import { FinalRoom } from './components/FinalRoom';
import { SecretRoomModal } from './components/SecretRoomModal';
import { HiddenNoteModal } from './components/HiddenNoteModal';
import { EasterEggsModal } from './components/EasterEggsModal';
import { AchievementsModal } from './components/AchievementsModal';

export default function App() {
  const [state, setState] = useState<MansionState>(() => loadMansionState());
  const [currentRoom, setCurrentRoom] = useState<number | null>(null);

  // Modals state
  const [showSecretRoom, setShowSecretRoom] = useState(false);
  const [showHiddenNote, setShowHiddenNote] = useState(false);
  const [showEasterEggs, setShowEasterEggs] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Easter egg states
  const [chandelierTaps, setChandelierTaps] = useState(0);
  const [activeToast, setActiveToast] = useState<{ title: string; desc: string } | null>(null);

  // Title long-press timer reference
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressingTitle, setIsPressingTitle] = useState(false);

  // Keyboard typed buffer for "hello"
  const typedBuffer = useRef<string>('');

  // Persist state changes
  useEffect(() => {
    saveMansionState(state);
  }, [state]);

  // Sync audio mute state
  useEffect(() => {
    sound.setMuted(state.soundMuted);
  }, [state.soundMuted]);

  // Toast notification helper
  const showToast = (title: string, desc: string) => {
    setActiveToast({ title, desc });
    setTimeout(() => {
      setActiveToast((curr) => (curr?.title === title ? null : curr));
    }, 4000);
  };

  // Unlock achievement helper
  const unlockAchievement = (id: string) => {
    if (state.achievements.includes(id)) return;
    const ach = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    setState((prev) => ({
      ...prev,
      achievements: Array.from(new Set([...prev.achievements, id])),
    }));
    if (ach) {
      sound.playEasterEgg();
      triggerHaptic([60, 40, 80]);
      showToast(`Achievement Unlocked!`, `${ach.title}: ${ach.description}`);
    }
  };

  // Shake detection listener
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastUpdate = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const current = performance.now();
      if (current - lastUpdate < 150) return;

      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const diffTime = current - lastUpdate;
      lastUpdate = current;

      const speed =
        (Math.abs(acc.x + acc.y + acc.z - lastX - lastY - lastZ) / diffTime) * 10000;

      if (speed > 800) {
        handleShakeTrigger();
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, []);

  // Spacebar and "hello" keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar triggers confetti shower
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT') {
        e.preventDefault();
        handleShakeTrigger();
        return;
      }

      // Track last characters for "hello"
      if (e.key && e.key.length === 1) {
        typedBuffer.current = (typedBuffer.current + e.key.toLowerCase()).slice(-5);
        if (typedBuffer.current === 'hello') {
          handleHelloTrigger();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger shake / spacebar confetti
  const handleShakeTrigger = () => {
    sound.playSuccess();
    triggerHaptic([80, 40, 120]);
    fireShower();
    setState((prev) => ({
      ...prev,
      easterEggs: { ...prev.easterEggs, shake: true },
    }));
    unlockAchievement('shower_of_joy');
  };

  // Trigger "hello" secret
  const handleHelloTrigger = () => {
    sound.playGrandFanfare();
    triggerHaptic([100, 50, 150]);
    fireMansionConfetti();
    setState((prev) => ({
      ...prev,
      easterEggs: { ...prev.easterEggs, hello: true },
    }));
    unlockAchievement('typing_whiz');
    showToast('Secret Command Unlocked', 'You typed "hello"! Welcome to the inner circle.');
  };

  // Chandelier tap handler
  const handleChandelierTap = () => {
    setChandelierTaps((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        sound.playGrandFanfare();
        triggerHaptic([100, 50, 100, 50, 200]);
        fireMansionConfetti();
        setState((st) => ({
          ...st,
          easterEggs: { ...st.easterEggs, chandelier: true },
        }));
        unlockAchievement('chandelier_climber');
        showToast('Crystal Resonance', 'The grand chandelier swung with electric sparks!');
        return 0;
      }
      return next;
    });
  };

  // Title long-press handlers
  const handleTitlePressStart = () => {
    setIsPressingTitle(true);
    longPressTimer.current = setTimeout(() => {
      sound.playEasterEgg();
      triggerHaptic([80, 50, 100]);
      setShowHiddenNote(true);
      setState((prev) => ({
        ...prev,
        easterEggs: { ...prev.easterEggs, longPress: true },
      }));
      unlockAchievement('heart_of_gold');
      setIsPressingTitle(false);
    }, 1200);
  };

  const handleTitlePressEnd = () => {
    setIsPressingTitle(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Door opening handler
  const handleOpenDoor = (doorNumber: number) => {
    unlockAchievement('door_opener');
    if (doorNumber === 5) {
      unlockAchievement('mansion_master');
    }
    setCurrentRoom(doorNumber);
  };

  // Door completion handlers
  const markDoorComplete = (doorNumber: number) => {
    setState((prev) => {
      const nextCompleted = Array.from(new Set([...prev.completedDoors, doorNumber]));
      return {
        ...prev,
        completedDoors: nextCompleted,
      };
    });

    if (doorNumber === 1) unlockAchievement('wisdom_seeker');
    if (doorNumber === 2) unlockAchievement('quiz_master');
    if (doorNumber === 3) unlockAchievement('treasure_hunter');
    if (doorNumber === 4) unlockAchievement('fortune_seeker');
    if (doorNumber === 5) unlockAchievement('mansion_master');
  };

  // Reset progress handler
  const handleReset = () => {
    const fresh = resetMansionStorage();
    setState(fresh);
    setCurrentRoom(null);
    setShowResetConfirm(false);
    showToast('Mansion Reset', 'All progress has been reset for a fresh experience.');
  };

  // Toggle sound
  const toggleSound = () => {
    sound.playClick();
    const nextMuted = !state.soundMuted;
    sound.setMuted(nextMuted);
    setState((prev) => ({ ...prev, soundMuted: nextMuted }));
  };

  return (
    <div className="min-h-screen bg-[#050B1F] text-[#F0F6FC] flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#050B1F]/85 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Title with Long-Press Easter Egg Trigger */}
        <div
          onMouseDown={handleTitlePressStart}
          onMouseUp={handleTitlePressEnd}
          onMouseLeave={handleTitlePressEnd}
          onTouchStart={handleTitlePressStart}
          onTouchEnd={handleTitlePressEnd}
          className={`cursor-pointer select-none transition-transform active:scale-98 ${
            isPressingTitle ? 'scale-95 text-amber-300' : ''
          }`}
          title="Press & hold for 1.2s to reveal hidden note"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight font-display text-white hover:text-cyan-200 transition-colors">
              Surprise Mansion
            </h1>
            {isPressingTitle && (
              <span className="text-[10px] font-mono text-amber-300 animate-pulse">
                (Decrypting...)
              </span>
            )}
          </div>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Achievements Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              setShowAchievements(true);
            }}
            className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-xl mansion-glass text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono active:scale-95"
            title="View Achievements"
            aria-label="Achievements"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Honors</span>
            <span className="text-amber-400 font-bold">
              {state.achievements.length}
            </span>
          </button>

          {/* Secrets / Easter Eggs Helper */}
          <button
            onClick={() => {
              sound.playClick();
              setShowEasterEggs(true);
            }}
            className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-xl mansion-glass text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all text-xs font-mono active:scale-95"
            title="Easter Eggs & Clues"
            aria-label="Easter Eggs"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Secrets</span>
            <span className="text-cyan-300">
              {Object.values(state.easterEggs).filter(Boolean).length}/6
            </span>
          </button>

          {/* Audio Mute / Unmute */}
          <button
            onClick={toggleSound}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl mansion-glass text-slate-300 hover:text-white transition-all active:scale-95"
            title={state.soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Sound Toggle"
          >
            {state.soundMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300" />
            )}
          </button>

          {/* Reset Mansion */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl mansion-glass text-slate-400 hover:text-rose-400 transition-all active:scale-95"
            title="Reset Progress"
            aria-label="Reset Mansion"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative">
        {currentRoom === null && (
          <Hallway
            completedDoors={state.completedDoors}
            onOpenDoor={handleOpenDoor}
            onOpenPainting={() => {
              setState((prev) => ({
                ...prev,
                easterEggs: { ...prev.easterEggs, painting: true },
              }));
              unlockAchievement('codebreaker');
              setShowSecretRoom(true);
            }}
            onOpenSecretSeal={() => {
              setState((prev) => ({
                ...prev,
                easterEggs: { ...prev.easterEggs, cornerButton: true },
              }));
              unlockAchievement('secret_finder');
              showToast('The Founder\'s Crest', 'Discovered the hidden seal in the corner.');
            }}
            onChandelierTap={handleChandelierTap}
            chandelierSwingCount={chandelierTaps}
          />
        )}

        {currentRoom === 1 && (
          <ScratchRoom
            onBack={() => setCurrentRoom(null)}
            onComplete={() => markDoorComplete(1)}
            isAlreadyCompleted={state.completedDoors.includes(1)}
          />
        )}

        {currentRoom === 2 && (
          <QuizRoom
            onBack={() => setCurrentRoom(null)}
            onComplete={(_title) => markDoorComplete(2)}
            isAlreadyCompleted={state.completedDoors.includes(2)}
          />
        )}

        {currentRoom === 3 && (
          <TreasureHuntRoom
            onBack={() => setCurrentRoom(null)}
            onComplete={() => markDoorComplete(3)}
            isAlreadyCompleted={state.completedDoors.includes(3)}
          />
        )}

        {currentRoom === 4 && (
          <WheelOfFate
            onBack={() => setCurrentRoom(null)}
            onComplete={() => markDoorComplete(4)}
            isAlreadyCompleted={state.completedDoors.includes(4)}
          />
        )}

        {currentRoom === 5 && (
          <FinalRoom
            onBack={() => setCurrentRoom(null)}
            onReplay={() => {
              setCurrentRoom(null);
            }}
          />
        )}
      </main>

      {/* Subtle Toast Banner */}
      {activeToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-bounce">
          <div className="p-3.5 rounded-2xl mansion-glass-gold border border-amber-400/50 shadow-2xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white font-display truncate">
                {activeToast.title}
              </h4>
              <p className="text-[11px] text-amber-200 truncate">
                {activeToast.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md mansion-glass rounded-2xl p-6 border border-rose-500/30 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-2 font-display">
              Reset All Mansion Progress?
            </h3>
            <p className="text-xs text-slate-300 mb-6">
              This will clear completed doors and achievements so you can experience the mystery mansion all over again.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SecretRoomModal
        isOpen={showSecretRoom}
        onClose={() => setShowSecretRoom(false)}
      />

      <HiddenNoteModal
        isOpen={showHiddenNote}
        onClose={() => setShowHiddenNote(false)}
      />

      <EasterEggsModal
        isOpen={showEasterEggs}
        onClose={() => setShowEasterEggs(false)}
        discovered={state.easterEggs}
        onTriggerHello={handleHelloTrigger}
        onTriggerShake={handleShakeTrigger}
      />

      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        unlockedIds={state.achievements}
      />
    </div>
  );
}
