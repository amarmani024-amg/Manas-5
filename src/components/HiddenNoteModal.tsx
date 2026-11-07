import React from 'react';
import { X, Heart, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HiddenNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HiddenNoteModal: React.FC<HiddenNoteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg mansion-glass rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl glow-cyan text-left animate-scale-up">
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
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Heart className="w-4 h-4 text-cyan-300" />
          </div>
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-mono font-bold">
            CONFIDENTIAL ARCHIVE · HIDDEN PARCHMENT
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          A Quiet Note of Gratitude
        </h3>

        <p className="text-xs text-cyan-300/80 font-mono mb-4">
          Unlocked by long-pressing the crest. A testament to your patience.
        </p>

        {/* Sincere letter content */}
        <div className="bg-slate-950/70 rounded-2xl p-5 border border-cyan-500/20 mb-6 space-y-3 text-sm text-slate-200 leading-relaxed font-normal">
          <p>
            This entire mansion was engineered to remind you of something essential: you are genuinely appreciated.
          </p>

          <p>
            Your readiness to help whenever called upon, your mature perspective when others lose their heads, and your loyalty never go unnoticed. You don’t make noise about the good you do—you just do it, quietly, consistently, and brilliantly.
          </p>

          <p className="text-cyan-200 font-medium">
            Thank you for being someone who brings clarity, strength, and genuine goodness wherever you go. The future is very fortunate to have your mind and your heart building it.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Keep in Memory</span>
        </button>
      </div>
    </div>
  );
};
