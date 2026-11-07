// Realistic Physical Sound Synthesizer for Xiangqi (Web Audio API)
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
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


  // 1. Crisp, tactile wooden piece placement ("Cạch!")
  playMove() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Layer A: Sharp Hardwood Impact Transient
      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(1450, now);
      click.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      clickGain.gain.setValueAtTime(0.7, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      click.connect(clickGain);
      clickGain.connect(ctx.destination);
      click.start(now);
      click.stop(now + 0.04);

      // Layer B: Resonant Wood Body Tone (Hollow wooden board acoustic chamber)
      const body = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      const bodyFilter = ctx.createBiquadFilter();

      body.type = 'sine';
      body.frequency.setValueAtTime(290, now);
      body.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(600, now);

      bodyGain.gain.setValueAtTime(0.65, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      body.connect(bodyFilter);
      bodyFilter.connect(bodyGain);
      bodyGain.connect(ctx.destination);

      body.start(now);
      body.stop(now + 0.1);

      // Layer C: Low table vibration thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(120, now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.07);

      thudGain.gain.setValueAtTime(0.4, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(now);
      thud.stop(now + 0.08);

    } catch {
      // Ignored if browser blocks audio autoplay
    }
  }

  // 2. Heavy, satisfying double-wood strike for piece capture ("Cốp!")
  playCapture() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Primary heavy strike
      const strike = ctx.createOscillator();
      const strikeGain = ctx.createGain();
      strike.type = 'sawtooth';
      strike.frequency.setValueAtTime(680, now);
      strike.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      strikeGain.gain.setValueAtTime(0.75, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      // Secondary wood clack 20ms later (token bouncing off captured token)
      const secondary = ctx.createOscillator();
      const secGain = ctx.createGain();
      secondary.type = 'triangle';
      secondary.frequency.setValueAtTime(920, now + 0.02);
      secondary.frequency.exponentialRampToValueAtTime(260, now + 0.07);

      secGain.gain.setValueAtTime(0.55, now + 0.02);
      secGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      // Deep table punch bass
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(180, now);
      bass.frequency.exponentialRampToValueAtTime(38, now + 0.18);

      bassGain.gain.setValueAtTime(0.85, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      // Filter to make strike organic, not harsh
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1800, now);
      lowpass.frequency.exponentialRampToValueAtTime(400, now + 0.15);

      strike.connect(lowpass);
      secondary.connect(lowpass);
      lowpass.connect(strikeGain);
      strikeGain.connect(ctx.destination);
      secGain.connect(ctx.destination);

      bass.connect(bassGain);
      bassGain.connect(ctx.destination);

      strike.start(now);
      strike.stop(now + 0.07);
      secondary.start(now + 0.02);
      secondary.stop(now + 0.08);
      bass.start(now);
      bass.stop(now + 0.19);

    } catch {
      // Ignored
    }
  }

  // 3. Ancient Bronze Temple Bell / Gong chime when in Check ("CHIẾU TƯỚNG!")
  playCheck() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Bronze bell natural inharmonic partials
      const partials = [
        { freq: 280, gain: 0.5, decay: 1.8 },   // Fundamental hum
        { freq: 418, gain: 0.45, decay: 1.5 },  // Prime / minor third
        { freq: 624, gain: 0.35, decay: 1.2 },  // Tierce
        { freq: 940, gain: 0.25, decay: 0.8 },  // Quint
        { freq: 1350, gain: 0.15, decay: 0.5 }, // High metallic strike
      ];

      partials.forEach(p => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Subtle vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(4.5, now);
        lfoGain.gain.setValueAtTime(p.freq * 0.015, now);

        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + p.decay);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, now);

        gain.gain.setValueAtTime(p.gain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + p.decay + 0.05);
      });

    } catch {
      // Ignored
    }
  }

  // 4. Grand Eastern Pentatonic Victory Fanfare
  playVictory() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Oriental pentatonic melody notes: C4 -> E4 -> G4 -> A4 -> C5 -> E5 -> G5
      const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 783.99, 1046.50];
      const spacing = 0.13;

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * spacing;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        const duration = idx === notes.length - 1 ? 1.6 : 0.6;
        gain.gain.setValueAtTime(0.35, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration + 0.05);
      });

    } catch {
      // Ignored
    }
  }

  // 5. Smooth wooden slide / tap for select & undo
  playTap() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundController();
