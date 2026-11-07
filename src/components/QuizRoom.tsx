import React, { useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, ChevronRight, Dumbbell, Cpu, Sparkles, SkipForward } from 'lucide-react';
import { sound, triggerHaptic } from '../utils/audio';
import { fireMansionConfetti } from '../utils/confetti';

interface QuizRoomProps {
  onBack: () => void;
  onComplete: (titleAwarded: string) => void;
  isAlreadyCompleted: boolean;
}

interface Question {
  id: number;
  category: 'TECH' | 'GYM' | 'LIFE';
  text: string;
  options: {
    label: string;
    comment: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'TECH',
    text: 'A production deployment goes live in 5 minutes and an unexpected bug appears. What is your move?',
    options: [
      {
        label: 'Stay calm, trace the root cause with laser focus, and patch it in two lines.',
        comment: 'Elite composure. The hallmarks of a master engineer.',
      },
      {
        label: 'Drink a sip of cold water and stare the compiler into total submission.',
        comment: 'Legendary presence. Even the linter respects your gaze.',
      },
      {
        label: 'Formulate an elegant mathematical workaround that prevents future edge-cases.',
        comment: 'Thinking three steps ahead. Pure architectural brilliance.',
      },
    ],
  },
  {
    id: 2,
    category: 'GYM',
    text: 'Heavy leg day has arrived, but your schedule is jam-packed with tasks. How do you handle it?',
    options: [
      {
        label: 'The squat rack calls and you answer. Discipline never takes a holiday.',
        comment: 'Relentless consistency. Iron sharpens iron.',
      },
      {
        label: 'Execute an ultra-efficient high-density session at dawn with zero wasted minutes.',
        comment: 'Engineering principles applied to human peak performance.',
      },
      {
        label: 'Calves may lodge formal complaints tomorrow, but your willpower will not bend.',
        comment: 'Respectable grit. The weights know who is boss.',
      },
    ],
  },
  {
    id: 3,
    category: 'LIFE',
    text: 'Someone asks for your guidance on a complex problem late on a Friday evening. What do you do?',
    options: [
      {
        label: 'Jump in without hesitation, break it down clearly, and help them succeed.',
        comment: 'Your loyalty and helpfulness are unmatched.',
      },
      {
        label: 'Offer an impromptu masterclass with patience, clarity, and zero arrogance.',
        comment: 'Maturity well beyond 23 years. A natural leader.',
      },
      {
        label: 'Diagnose the bottleneck in under 60 seconds and optimize it to O(1).',
        comment: 'Speed and generosity in perfect equilibrium.',
      },
    ],
  },
  {
    id: 4,
    category: 'TECH',
    text: 'What is your core superpower as an engineer?',
    options: [
      {
        label: 'Translating chaotic specifications into rock-solid, clean, modular systems.',
        comment: 'The hallmark of true engineering maturity.',
      },
      {
        label: 'Learning complex frameworks at breakneck speed while keeping code pristine.',
        comment: 'High processing speed with high aesthetic standard.',
      },
      {
        label: 'Staying grounded, humble, and dependable no matter how big the stakes get.',
        comment: 'Character is destiny, and yours is forged of gold.',
      },
    ],
  },
  {
    id: 5,
    category: 'LIFE',
    text: 'Looking ahead across the coming years, what is the ultimate trajectory?',
    options: [
      {
        label: 'Building breakthrough solutions, breaking personal bests, and uplifting people.',
        comment: 'A mission worthy of your boundless talent.',
      },
      {
        label: 'Leading transformative engineering projects while keeping your values unshakeable.',
        comment: 'Vision backed by genuine integrity.',
      },
      {
        label: 'All of the above, plus executing every ambition with quiet mastery.',
        comment: 'The definitive blueprint. Unstoppable.',
      },
    ],
  },
];

export const QuizRoom: React.FC<QuizRoomProps> = ({
  onBack,
  onComplete,
  isAlreadyCompleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(isAlreadyCompleted);
  const awardedTitle = 'Certified Legend: Master of Mind & Iron';

  const currentQ = QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    sound.playClick();
    triggerHaptic([40]);
    setSelectedOption(idx);
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const handleSkip = () => {
    sound.playClick();
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    sound.playSuccess();
    triggerHaptic([100, 50, 150]);
    fireMansionConfetti();
    setFinished(true);
    onComplete(awardedTitle);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Bar */}
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
          Door 02 · Quiz Room
        </span>
      </div>

      {/* Mandatory One-Line Instruction */}
      <div className="w-full text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-display">
          The Mind & Iron Trial
        </h2>
        <p className="text-sm sm:text-base text-cyan-200/90 font-medium bg-cyan-950/40 py-2.5 px-4 rounded-xl border border-cyan-500/20 max-w-xl mx-auto shadow-inner">
          Choose the answer that best matches your legendary mindset.
        </p>
      </div>

      {!finished ? (
        <div className="w-full mansion-glass rounded-2xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/15">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              {currentQ.category === 'TECH' && <Cpu className="w-4 h-4 text-cyan-400" />}
              {currentQ.category === 'GYM' && <Dumbbell className="w-4 h-4 text-amber-400" />}
              {currentQ.category === 'LIFE' && <Sparkles className="w-4 h-4 text-indigo-400" />}
              <span className="font-semibold tracking-wider">{currentQ.category} ROUND</span>
            </div>

            <div className="text-xs font-mono text-slate-300">
              Question {currentIndex + 1} of {QUESTIONS.length}
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-6 leading-relaxed">
            {currentQ.text}
          </h3>

          {/* Options */}
          <div className="space-y-3.5 mb-6">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full min-h-[52px] p-4 rounded-xl text-left transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/40 border-cyan-500/15 text-slate-200 hover:border-cyan-400/50 hover:bg-slate-900/70'
                  } active:scale-99`}
                >
                  <span
                    className={`min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold mt-0.5 ${
                      isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-normal">{option.label}</p>
                    {isSelected && (
                      <p className="mt-2 text-xs text-amber-300 font-mono italic">
                        ↳ {option.comment}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSkip}
              className="min-h-[44px] px-4 py-2 text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip Question</span>
            </button>

            <button
              disabled={selectedOption === null}
              onClick={handleNext}
              className={`min-h-[48px] px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                selectedOption !== null
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95'
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span>{currentIndex === QUESTIONS.length - 1 ? 'Finish & Claim Title' : 'Next Question'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Result Award Card */
        <div className="w-full mansion-glass-gold rounded-2xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl text-center flex flex-col items-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4 text-amber-300 glow-gold">
            <Award className="w-9 h-9" />
          </div>

          <span className="text-xs uppercase tracking-widest text-amber-400 font-mono mb-2">
            OFFICIAL CONFERMENT
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-display">
            {awardedTitle}
          </h3>

          <p className="text-sm sm:text-base text-slate-200 max-w-lg mb-6 leading-relaxed">
            Your decisions exhibit an exceptional fusion of high intellect, ironclad discipline, and generous helpfulness. You operate with seasoned composure and clear vision.
          </p>

          <div className="w-full bg-slate-900/60 rounded-xl p-4 border border-amber-500/20 mb-6 text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono">Intellectual Capacity:</span>
              <span className="text-cyan-400 font-semibold font-mono">Top Tier</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono">Gym & Mental Grit:</span>
              <span className="text-amber-400 font-semibold font-mono">Unshakable</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-mono">Reliability & Character:</span>
              <span className="text-emerald-400 font-semibold font-mono">Pure Gold</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Return to Hallway</span>
          </button>
        </div>
      )}
    </div>
  );
};
