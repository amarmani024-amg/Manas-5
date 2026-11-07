import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, Key, Search, Compass, Crown, Eye, Shield, Zap, Terminal, PartyPopper, Scroll } from 'lucide-react';
import { ALL_ACHIEVEMENTS } from '../utils/storage';
import { sound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  unlockedIds,
}) => {
  if (!isOpen) return null;

  const renderIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-5 h-5 ${isUnlocked ? 'text-amber-400' : 'text-slate-500'}` };
    switch (iconName) {
      case 'Key': return <Key {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Search': return <Search {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'Eye': return <Eye {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'PartyPopper': return <PartyPopper {...props} />;
      case 'Scroll': return <Scroll {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const unlockedCount = unlockedIds.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const percentage = Math.round((unlockedCount / totalCount) * 100);

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

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-cyan-300 font-mono font-bold">
            HONORS & MILESTONES
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 font-display">
          Achievements
        </h3>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span>Progress: {unlockedCount} of {totalCount} unlocked</span>
            <span className="text-amber-400 font-bold">{percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-500/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Achievement Grid / List */}
        <div className="space-y-3">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'mansion-glass-gold border-amber-400/30 bg-amber-950/20 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-amber-500/20 border-amber-400/50 glow-gold'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  {isUnlocked ? renderIcon(ach.iconName, true) : <Lock className="w-4 h-4 text-slate-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate font-display">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-400/30">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 truncate mt-0.5">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
