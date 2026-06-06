type SoundType = 'click' | 'observe' | 'write' | 'page' | 'echo'

class AudioEngine {
  private ctx: AudioContext | null = null
  private enabled = true

  /** 首次用户交互时调用，创建 AudioContext */
  init() {
    if (this.ctx) return
    try {
      this.ctx = new AudioContext()
    } catch {
      // Web Audio not supported
    }
  }

  setEnabled(v: boolean) {
    this.enabled = v
  }

  play(sound: SoundType) {
    if (!this.enabled || !this.ctx) return
    // Resume if suspended (mobile autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    switch (sound) {
      case 'click': this.playClick(); break
      case 'observe': this.playObserve(); break
      case 'write': this.playWrite(); break
      case 'page': this.playPage(); break
      case 'echo': this.playEcho(); break
    }
  }

  /** 最轻最短，几乎不注意 — 低通 600Hz 噪声 40ms */
  private playClick() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const duration = 0.04
    const buffer = this.createNoiseBuffer(duration)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
    source.stop(now + duration)
  }

  /** 柔和发现感 — 正弦 320→520Hz sweep 150ms */
  private playObserve() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const duration = 0.15
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.linearRampToValueAtTime(520, now + duration)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + duration)
  }

  /** 纸张摩擦 + 极轻 click — 噪声 1.5kHz + 正弦 800Hz 100ms */
  private playWrite() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const duration = 0.1
    // Noise part
    const buffer = this.createNoiseBuffer(duration)
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.value = 1500
    noiseFilter.Q.value = 0.5
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.06, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination)
    noise.start(now)
    noise.stop(now + duration)
    // Click part
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 800
    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.04, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    osc.connect(oscGain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  /** 翻页声 shhhh — 高通 1.2kHz 噪声 120ms，最重要 */
  private playPage() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const duration = 0.12
    const buffer = this.createNoiseBuffer(duration)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1200
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.3)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    source.connect(filter).connect(gain).connect(ctx.destination)
    source.start(now)
    source.stop(now + duration)
  }

  /** 低沉回响 — 正弦 220Hz exponential decay 300ms */
  private playEcho() {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const duration = 0.3
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 220
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
    osc.connect(gain).connect(ctx.destination)
    osc.start(now)
    osc.stop(now + duration)
  }

  /** 创建白噪声 buffer */
  private createNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.ctx!
    const sampleRate = ctx.sampleRate
    const length = Math.ceil(sampleRate * duration)
    const buffer = ctx.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1
    }
    return buffer
  }
}

export const audio = new AudioEngine()
