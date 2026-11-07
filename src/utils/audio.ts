/**
 * WebAudio sound effects synthesizer
 * Generates custom synthesized chimes, clicks, scratches, and fanfares.
 * Starts strictly after the first user gesture.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft glassy UI tap
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  // Scratch card friction sound
  public playScratch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // White noise buffer
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200 + Math.random() * 400;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {
      // AudioContext fallback
    }
  }

  // Resonant mansion door opening chime
  public playDoorOpen() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [130.81, 196.00, 261.63, 392.00, 523.25]; // C3, G3, C4, G4, C5
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startOffset = idx * 0.08;

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + startOffset);

        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + startOffset + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + 1.25);
      });
    } catch {
      // safe fallback
    }
  }

  // Wheel tick sound
  public playWheelTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // safe fallback
    }
  }

  // Chandelier crystal resonance
  public playChandelier() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const pitches = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      const now = this.ctx.currentTime;

      pitches.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.85);
      });
    } catch {
      // safe fallback
    }
  }

  // Win / room completed fanfare
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chords = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
      const now = this.ctx.currentTime;

      chords.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const offset = idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + offset);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.linearRampToValueAtTime(0.14, now + offset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 1.5);
      });
    } catch {
      // safe fallback
    }
  }

  // Grand finale fanfare
  public playGrandFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const notes = [
        { f: 261.63, t: 0, d: 0.3 },
        { f: 329.63, t: 0.15, d: 0.3 },
        { f: 392.00, t: 0.3, d: 0.3 },
        { f: 523.25, t: 0.45, d: 0.8 },
        { f: 659.25, t: 0.75, d: 0.8 },
        { f: 783.99, t: 0.95, d: 1.5 },
        { f: 1046.50, t: 1.1, d: 2.0 },
      ];
      const now = this.ctx.currentTime;

      notes.forEach((n) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.linearRampToValueAtTime(0.16, now + n.t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.1);
      });
    } catch {
      // safe fallback
    }
  }

  // Easter egg discovery sound
  public playEasterEgg() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // safe fallback
    }
  }
}

export const sound = new SoundController();

// Safe mobile haptic vibration
export function triggerHaptic(pattern: number[] = [80, 40, 120]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // vibrate disallowed
    }
  }
}
