/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Universal Web Audio Synthesizer for "Deep Stratum Dive"
class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeLoopGains: { [key: string]: GainNode } = {};
  private activeLoopSources: { [key: string]: AudioNode[] } = {};

  constructor() {
    // Audio Context is initialized lazily upon first interaction to satisfy browser policies.
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.ctx) {
        this.ctx.suspend();
      }
    } else {
      this.initCtx();
    }
    return this.isMuted;
  }

  public getMuteStatus() {
    return this.isMuted;
  }

  // Create bandpass/lowpass filtered white/pink sound noise buffer
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) return new AudioBuffer({ length: 1, sampleRate: 44100 });
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  // UI Sounds
  public playClick() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  public playElevatorWhoosh() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    // A swift elevator whoosh (synthesized engine hum soaring up)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  }

  // Layer 1: Modern Wind & Birds (Chirps)
  public playModernBird() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const osc1 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    // Classic bird chirp sweep
    osc1.frequency.setValueAtTime(1800, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.05);
    osc1.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc1.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc1.stop(ctx.currentTime + 0.16);
  }

  // Layer 2: Ice cracking sound
  public playIceCrack() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const duration = 0.38;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);
    filter.Q.setValueAtTime(12, ctx.currentTime);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Add high crackly spikes using noise
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start();
    noise.start();
    osc.stop(ctx.currentTime + duration);
    noise.stop(ctx.currentTime + duration);
  }

  // Layer 3: Meteor Falling Sweep + Huge Explosion + Impact Thuds
  public playMeteorStrike(onFlash: () => void, onShake: () => void) {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    // Part A: Whistle/Scream sound (Meteor descending)
    const whistle = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(2500, ctx.currentTime);
    whistle.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 1.2);

    whistleGain.gain.setValueAtTime(0.001, ctx.currentTime);
    whistleGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.9);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    whistle.connect(whistleGain);
    whistleGain.connect(ctx.destination);
    whistle.start();
    whistle.stop(ctx.currentTime + 1.2);

    // Part B: The Giant Explosion and Earthquake Rumble
    // Trigger flash screen/shake via callbacks at 1.1s
    setTimeout(() => {
      onFlash();
      onShake();
      this.triggerExplosionSound();
    }, 1100);
  }

  private triggerExplosionSound() {
    const ctx = this.ctx;
    if (!ctx || this.isMuted) return;

    // Main rumble
    const rumble = ctx.createBufferSource();
    rumble.buffer = this.createNoiseBuffer();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

    rumble.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Sub Bass Boom
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, ctx.currentTime);
    sub.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.5);

    subGain.gain.setValueAtTime(0.5, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    sub.connect(subGain);
    subGain.connect(ctx.destination);

    rumble.start();
    sub.start();

    rumble.stop(ctx.currentTime + 3.0);
    sub.stop(ctx.currentTime + 3.0);
  }

  // Stamp Dino extinction card thud
  public playExtinctStamp() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const noiseFilter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.25);

    noise.buffer = this.createNoiseBuffer();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, ctx.currentTime);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.35);

    osc.connect(gain);
    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    noise.start();

    osc.stop(ctx.currentTime + 0.4);
    noise.stop(ctx.currentTime + 0.4);
  }

  // Layer 4: Jurassic Dino Sound (Brachiosaurus Call - deep resonance bellow)
  public playSauropodRoar() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const duration = 1.6;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Deep modulating frequencies
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(75, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(65, ctx.currentTime + 0.3);
    osc1.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + duration);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(152, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(130, ctx.currentTime + 0.5);
    osc2.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + duration);

    // LFO to create growling vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(12, ctx.currentTime); // 12 Hz wobble
    lfoGain.gain.setValueAtTime(15, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(250, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.4);
    filterNode.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + duration);
    filterNode.Q.setValueAtTime(8, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.24, ctx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc1.connect(filterNode);
    osc2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    lfo.start();
    osc1.start();
    osc2.start();

    lfo.stop(ctx.currentTime + duration);
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  }

  // Branch rustle/dine bite
  public playLeafCrunch() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    // Crunch synthesized by short noise bursts + medium pitches
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1500, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.4);
  }

  // Layer 5: Primitive soup bubble pop (Lava gurgle)
  public playLavaBubble() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const duration = 0.28;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Glup bubble pitch bend up quickly
    osc.frequency.setValueAtTime(60, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(240, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  // Primordial double heartbeat pulse
  public playPrimordialHeartbeat() {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    // Two rapid soft low-freq dull thumps
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    // Pulse 1
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    // Pulse 2
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }

  // Start continuous ambient sound loop based on active layer
  // In Web Audio, loops can be created dynamically using oscillators and LFOs
  // so that we don't have static sound glitches!
  public startAmbientLoop(layerId: string) {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    this.stopAllAmbientLoops();

    const loopGain = ctx.createGain();
    loopGain.gain.setValueAtTime(0.0, ctx.currentTime);
    loopGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.0); // Smooth fade in
    loopGain.connect(ctx.destination);

    this.activeLoopGains[layerId] = loopGain;
    const sources: AudioNode[] = [];

    if (layerId === 'modern') {
      // Wind hum: pinkish filtered noise
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      // Modulate wind frequency with extra low sine wave
      const filterLfo = ctx.createOscillator();
      filterLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // very slow 0.12Hz
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(200, ctx.currentTime);

      filterLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(loopGain);

      filterLfo.start();
      noise.start();

      sources.push(noise, filterLfo);
    } else if (layerId === 'ice_age') {
      // Deeper frozen howling wind
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const filterLfo = ctx.createOscillator();
      filterLfo.frequency.setValueAtTime(0.09, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(120, ctx.currentTime);

      filterLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(loopGain);

      filterLfo.start();
      noise.start();

      sources.push(noise, filterLfo);
    } else if (layerId === 'cretaceous') {
      // Eerie quiet static tense hum
      const osc = ctx.createOscillator();
      const oscVibe = ctx.createOscillator();
      const vibeGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, ctx.currentTime);

      oscVibe.frequency.value = 2; // Hz
      vibeGain.gain.value = 4; // micro-pitch adjustments

      oscVibe.connect(vibeGain);
      vibeGain.connect(osc.frequency);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      osc.connect(filter);
      filter.connect(loopGain);

      osc.start();
      oscVibe.start();

      sources.push(osc, oscVibe);
    } else if (layerId === 'jurassic') {
      // Warm jungle hum: low tone + buzzing crickets simulator
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      // Low hum filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);

      osc.connect(filter);
      filter.connect(loopGain);
      osc.start();
      sources.push(osc);

      // Insect high-freq pulsing trigger
      const insectOsc = ctx.createOscillator();
      insectOsc.type = 'sine';
      insectOsc.frequency.setValueAtTime(3500, ctx.currentTime);

      const mod = ctx.createOscillator();
      mod.frequency.setValueAtTime(18, ctx.currentTime); // 18Hz pulse
      const modGain = ctx.createGain();
      modGain.gain.setValueAtTime(400, ctx.currentTime);

      const insectGain = ctx.createGain();
      insectGain.gain.setValueAtTime(0.004, ctx.currentTime); // very quiet

      mod.connect(modGain);
      modGain.connect(insectOsc.frequency);
      insectOsc.connect(insectGain);
      insectGain.connect(loopGain);

      insectOsc.start();
      mod.start();
      sources.push(insectOsc, mod);
    } else if (layerId === 'precambrian') {
      // Boiling lava magma rumble
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer();
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(65, ctx.currentTime); // extremely low

      // Sub-harmonic lava swell
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime);

      const slowSwell = ctx.createOscillator();
      slowSwell.frequency.setValueAtTime(0.18, ctx.currentTime); // 0.18 Hz LFO
      const swellGain = ctx.createGain();
      swellGain.gain.setValueAtTime(0.04, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.06, ctx.currentTime);

      slowSwell.connect(swellGain);
      swellGain.connect(subGain.gain);

      osc.connect(subGain);
      subGain.connect(loopGain);

      noise.connect(filter);
      filter.connect(loopGain);

      noise.start();
      osc.start();
      slowSwell.start();

      sources.push(noise, osc, slowSwell);
    }

    this.activeLoopSources[layerId] = sources;
  }

  public stopAllAmbientLoops() {
    // Graceful fade out
    const ctx = this.ctx;
    const fadeDuration = 0.5;

    for (const lid in this.activeLoopGains) {
      const g = this.activeLoopGains[lid];
      const srcs = this.activeLoopSources[lid] || [];

      if (ctx && g) {
        try {
          g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + fadeDuration);

          setTimeout(() => {
            srcs.forEach(s => {
              try {
                (s as any).stop();
              } catch (_) {}
            });
          }, fadeDuration * 1000 + 50);
        } catch (e) {
          // ignore
        }
      }
      delete this.activeLoopGains[lid];
      delete this.activeLoopSources[lid];
    }
  }
}

export const soundSynth = new SoundSynthesizer();
