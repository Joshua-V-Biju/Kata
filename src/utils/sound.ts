// Web Audio API Synthesizer for anime-style sound effects & ambient focus drone
// Completely offline, zero asset files required, smooth 60fps response

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDronePlaying: boolean = false;

  constructor() {}

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.isDronePlaying) {
      this.stopFocusDrone();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Crisp anime-style crystal chime for ticking a habit
  public playCheckmark() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6
    osc.frequency.exponentialRampToValueAtTime(2637, now + 0.22); // E7

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Heroic ascending arpeggio fanfare for Level-Up
  public playLevelUp() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.46);
    });
  }

  // Deep resonant zen chime for sprint timer finish
  public playSprintDone() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  // Bonus streak sound
  public playCombo() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [659.25, 880, 1174.66]; // E5, A5, D6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = now + i * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.001, st);
      gain.gain.linearRampToValueAtTime(0.15, st + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(st);
      osc.stop(st + 0.26);
    });
  }

  // Industrial metallic anvil strike for Forge mode PRs & completed sets
  public playAnvilHit() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Low body impact (metallic iron thud)
    const lowOsc = ctx.createOscillator();
    const lowGain = ctx.createGain();
    lowOsc.type = 'triangle';
    lowOsc.frequency.setValueAtTime(140, now);
    lowOsc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    lowGain.gain.setValueAtTime(0.001, now);
    lowGain.gain.linearRampToValueAtTime(0.35, now + 0.015);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    lowOsc.connect(lowGain);
    lowGain.connect(ctx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 0.46);

    // High anvil ping (steel resonance)
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(2480, now);
    highOsc.frequency.exponentialRampToValueAtTime(1240, now + 0.35);

    highGain.gain.setValueAtTime(0.001, now);
    highGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(now);
    highOsc.stop(now + 0.72);
  }

  // Rest timer countdown beep (low ping for 3, 2, 1; high gong for Go)
  public playRestBeep(isGo: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (isGo) {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    } else {
      osc.frequency.setValueAtTime(587.33, now); // D5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isGo ? 0.52 : 0.16));
  }

  // Synthesized Cyber Ambient Binaural Focus Drone (108 Hz + 114 Hz binaural beat)
  public toggleFocusDrone(): boolean {
    if (this.isDronePlaying) {
      this.stopFocusDrone();
      return false;
    } else {
      this.startFocusDrone();
      return true;
    }
  }

  public startFocusDrone() {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopFocusDrone();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Binaural alpha frequency: 108Hz and 114Hz -> 6Hz theta brainwave focus
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(108, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(114, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 1.5); // Gentle soft volume

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    this.droneOsc1 = osc1;
    this.droneOsc2 = osc2;
    this.droneGain = gain;
    this.isDronePlaying = true;
  }

  public stopFocusDrone() {
    if (this.droneGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
        } catch (e) {}
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.droneGain = null;
        this.isDronePlaying = false;
      }, 850);
    } else {
      this.isDronePlaying = false;
    }
  }

  public isFocusDroneActive(): boolean {
    return this.isDronePlaying;
  }
}

export const soundEngine = new SoundEngine();
