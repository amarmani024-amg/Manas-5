export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: number;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'Threshold Crossed', description: 'Stepped into Surprise Mansion', iconName: 'Compass' },
  { id: 'door_opener', title: 'Door Opener', description: 'Entered your first mystery room', iconName: 'Key' },
  { id: 'wisdom_seeker', title: 'Wisdom Seeker', description: 'Scratched every card in Room 1', iconName: 'Sparkles' },
  { id: 'quiz_master', title: 'Certified Legend', description: 'Mastered the Mind & Iron challenge', iconName: 'Award' },
  { id: 'treasure_hunter', title: 'Treasure Hunter', description: 'Found all 3 hidden artifacts in the navy study', iconName: 'Search' },
  { id: 'fortune_seeker', title: 'Fortune Seeker', description: 'Spun the Wheel of Fate', iconName: 'Compass' },
  { id: 'mansion_master', title: 'Mansion Master', description: 'Unlocked the Grand Finale at Door 5', iconName: 'Crown' },
  { id: 'codebreaker', title: 'Codebreaker', description: 'Discovered the hidden room behind the painting', iconName: 'Eye' },
  { id: 'secret_finder', title: 'Secret Finder', description: 'Found the clandestine corner seal', iconName: 'Shield' },
  { id: 'chandelier_climber', title: 'Chandelier Climber', description: 'Tapped the mansion chandelier 5 times', iconName: 'Zap' },
  { id: 'typing_whiz', title: 'Cryptic Typist', description: 'Typed the secret keyword "hello"', iconName: 'Terminal' },
  { id: 'shower_of_joy', title: 'Shower of Joy', description: 'Shook your device or pressed Space for confetti', iconName: 'PartyPopper' },
  { id: 'heart_of_gold', title: 'Heart of Gold', description: 'Revealed the hidden appreciation note', iconName: 'Scroll' },
];

export interface MansionState {
  completedDoors: number[]; // e.g. [1, 2, 3, 4, 5]
  achievements: string[]; // ids of unlocked achievements
  soundMuted: boolean;
  easterEggs: {
    hello: boolean;
    chandelier: boolean;
    cornerButton: boolean;
    painting: boolean;
    longPress: boolean;
    shake: boolean;
  };
}

const STORAGE_KEY = 'surprise_mansion_v2_state';

export const INITIAL_STATE: MansionState = {
  completedDoors: [],
  achievements: ['first_step'],
  soundMuted: false,
  easterEggs: {
    hello: false,
    chandelier: false,
    cornerButton: false,
    painting: false,
    longPress: false,
    shake: false,
  },
};

export function loadMansionState(): MansionState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      easterEggs: {
        ...INITIAL_STATE.easterEggs,
        ...(parsed.easterEggs || {}),
      },
      achievements: Array.from(new Set([...(parsed.achievements || []), 'first_step'])),
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveMansionState(state: MansionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded or disabled
  }
}

export function resetMansionStorage(): MansionState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return INITIAL_STATE;
}
