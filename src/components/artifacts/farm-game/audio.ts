/** Tiny synthesised sound effects, so the game needs no audio files. */

export type SfxName =
  | "plant"
  | "water"
  | "pluck"
  | "coin"
  | "deny"
  | "zap"
  | "boom"
  | "launch"
  | "land"
  | "ripe"
  | "ufo"
  | "pickup"
  | "ouch"
  | "buy";

export class Sfx {
  private ctx: AudioContext | null = null;
  private noiseBuf: AudioBuffer | null = null;
  muted = false;

  /** browsers only allow sound after a tap or key press, so call this from one */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    try {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const len = this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, len, len);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.noiseBuf = buf;
    } catch {
      this.ctx = null;
    }
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    to?: number,
    delay = 0,
  ) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  private noise(
    dur: number,
    vol: number,
    from: number,
    to: number,
    type: BiquadFilterType = "lowpass",
  ) {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuf) return;
    const t0 = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(from, t0);
    filter.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + dur + 0.02);
  }

  /** `n` raises the pitch for combos */
  play(name: SfxName, n = 0) {
    if (this.muted || !this.ctx || this.ctx.state !== "running") return;
    switch (name) {
      case "plant":
        this.tone(230, 0.08, "triangle", 0.12, 150);
        break;
      case "water":
        this.noise(0.14, 0.07, 2600, 900, "highpass");
        break;
      case "pluck":
        this.tone(
          480 * Math.pow(2, Math.min(n, 14) / 12),
          0.09,
          "sine",
          0.14,
          720 * Math.pow(2, Math.min(n, 14) / 12),
        );
        break;
      case "coin":
        this.tone(880, 0.07, "square", 0.05);
        this.tone(1320, 0.14, "square", 0.05, undefined, 0.07);
        break;
      case "buy":
        this.tone(520, 0.08, "triangle", 0.1);
        this.tone(780, 0.08, "triangle", 0.1, undefined, 0.08);
        this.tone(1040, 0.16, "triangle", 0.1, undefined, 0.16);
        break;
      case "deny":
        this.tone(150, 0.14, "sawtooth", 0.06, 110);
        break;
      case "zap":
        this.tone(900, 0.13, "sawtooth", 0.07, 180);
        break;
      case "boom":
        this.noise(0.5, 0.22, 500, 80);
        this.tone(90, 0.4, "sine", 0.2, 40);
        break;
      case "launch":
        this.noise(2.4, 0.2, 180, 1600);
        this.tone(70, 2.2, "sawtooth", 0.05, 260);
        break;
      case "land":
        this.noise(1.3, 0.14, 1400, 160);
        break;
      case "ripe":
        this.tone(1180, 0.06, "sine", 0.04);
        break;
      case "ufo":
        this.tone(420, 0.5, "sine", 0.06, 620);
        this.tone(630, 0.5, "sine", 0.04, 430);
        break;
      case "pickup":
        this.tone(660, 0.07, "triangle", 0.1, 990);
        this.tone(1320, 0.12, "triangle", 0.08, undefined, 0.07);
        break;
      case "ouch":
        this.tone(320, 0.22, "square", 0.07, 110);
        break;
    }
  }

  close() {
    void this.ctx?.close();
    this.ctx = null;
  }
}
