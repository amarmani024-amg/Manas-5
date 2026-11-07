import React from 'react';
import { X, Sparkles, BookOpen, Compass, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretRoomModal: React.FC<SecretRoomModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg mansion-glass-gold rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl glow-gold text-left animate-scale-up">
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

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-mono font-bold">
            SECRET ROOM · THE ARCHIVIST'S VAULT
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          Behind the Painting
        </h3>

        <p className="text-xs text-amber-200/80 font-mono mb-4">
          You noticed what ordinary passersby missed. Your attention to detail is sharp.
        </p>

        {/* Blueprint content card */}
        <div className="bg-slate-950/70 rounded-2xl p-5 border border-cyan-500/30 mb-6 space-y-3 font-mono text-xs text-cyan-200 leading-relaxed">
          <div className="flex items-center justify-between text-slate-400 border-b border-cyan-500/20 pb-2">
            <span>FILE: CLASSIFIED_BLUEPRINT.SCH</span>
            <span className="text-amber-400">UNRESTRICTED</span>
          </div>

          <p className="text-slate-200 font-sans text-sm">
            "True strength is never loud; it is steady. It is seen in how you handle responsibility without complaint, how you protect those who rely on you, and how you relentlessly sharpen your mind day in and day out."
          </p>

          <div className="pt-2 flex items-center gap-4 text-[11px] text-cyan-400">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> True North: Integrity
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Defense: Discipline
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Exit Secret Study</span>
        </button>
      </div>
    </div>
  );
};
