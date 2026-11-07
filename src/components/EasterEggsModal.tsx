import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, HelpCircle, Terminal, Smartphone, Flame, Zap, MousePointerClick, Shield } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireShower } from '../utils/confetti';

interface EasterEggsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discovered: {
    hello: boolean;
    chandelier: boolean;
    cornerButton: boolean;
    painting: boolean;
    longPress: boolean;
    shake: boolean;
  };
  onTriggerHello: () => void;
  onTriggerShake: () => void;
}

export const EasterEggsModal: React.FC<EasterEggsModalProps> = ({
  isOpen,
  onClose,
  discovered,
  onTriggerHello,
  onTriggerShake,
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [terminalMessage, setTerminalMessage] = useState('');

  if (!isOpen) return null;

  const totalDiscovered = Object.values(discovered).filter(Boolean).length;

  const handleTestTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedInput.trim().toLowerCase() === 'hello') {
      onTriggerHello();
      setTerminalMessage('Command accepted: Welcome, Architect.');
      setTypedInput('');
    } else {
      sound.playClick();
      setTerminalMessage(`Command not recognized: "${typedInput}". Try typing "hello".`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl mansion-glass rounded-3xl p-6 sm:p-8 border border-cyan-400/30 shadow-2xl glow-cyan text-left max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-mono font-bold">
            ARCHIVE OF SURPRISES & SECRETS
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          Mansion Easter Eggs
        </h3>

        <p className="text-xs text-slate-300 mb-6">
          Discovered: <span className="text-amber-400 font-mono font-bold">{totalDiscovered} of 6</span> hidden secrets.
        </p>

        {/* Secrets List with clues */}
        <div className="space-y-3 mb-6">
          {/* Secret 1: Shake phone or spacebar */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.shake ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">1. Shower of Joy</h4>
                <p className="text-xs text-slate-300">
                  {discovered.shake ? 'Unlocked! Shook phone or hit Space.' : 'Clue: Shake your phone or press the Space bar on desktop.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onTriggerShake();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono shrink-0 active:scale-95 transition-all"
            >
              Test Shake
            </button>
          </div>

          {/* Secret 2: Painting */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.painting ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">2. Secret Room Behind the Painting</h4>
                <p className="text-xs text-slate-300">
                  {discovered.painting ? 'Discovered! The vintage hallway painting tilted.' : 'Clue: Tap the framed oil painting hanging in the hallway.'}
                </p>
              </div>
            </div>
            {discovered.painting ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>

          {/* Secret 3: Long press title */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.longPress ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <MousePointerClick className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">3. Hidden Parchment Note</h4>
                <p className="text-xs text-slate-300">
                  {discovered.longPress ? 'Discovered! Long-pressed the mansion title.' : 'Clue: Press & hold the "Surprise Mansion" header title for 1.2s.'}
                </p>
              </div>
            </div>
            {discovered.longPress ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>

          {/* Secret 4: Type hello */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.hello ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">4. Secret Terminal Keyword</h4>
                <p className="text-xs text-slate-300">
                  {discovered.hello ? 'Accepted! Typed the password "hello".' : 'Clue: Type "hello" anywhere on your keyboard or keypad.'}
                </p>
              </div>
            </div>
            {discovered.hello ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>

          {/* Secret 5: Tap chandelier 5 times */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.chandelier ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">5. Crystal Resonance</h4>
                <p className="text-xs text-slate-300">
                  {discovered.chandelier ? 'Activated! Chandelier swung with sparks.' : 'Clue: Tap the grand hallway chandelier 5 times in a row.'}
                </p>
              </div>
            </div>
            {discovered.chandelier ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>

          {/* Secret 6: Hidden corner seal */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${discovered.cornerButton ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">6. The Founder's Corner Seal</h4>
                <p className="text-xs text-slate-300">
                  {discovered.cornerButton ? 'Unlocked! Found in bottom corner.' : 'Clue: A faint glowing seal rests in the bottom-right corner.'}
                </p>
              </div>
            </div>
            {discovered.cornerButton ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <HelpCircle className="w-5 h-5 text-slate-500 shrink-0" />
            )}
          </div>
        </div>

        {/* Mobile Terminal Input for "hello" */}
        <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/30">
          <form onSubmit={handleTestTerminal} className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Console input: type 'hello'..."
              className="flex-1 bg-transparent text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-100 text-xs font-mono"
            >
              Submit
            </button>
          </form>
          {terminalMessage && (
            <p className="mt-2 text-[11px] font-mono text-amber-300">{terminalMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};
