// packages/core/convolver-player-core/src/audioContextManager.ts

/**
 * Manages the creation, resumption, and closing of a Web Audio API AudioContext.
 * It can either use a provided AudioContext or create and manage its own.
 */
export class AudioContextManager {
  private localAudioContext: AudioContext | null = null;
  private _currentAudioContext: AudioContext | null = null;

  constructor(providedAudioContext: AudioContext | null = null) {
    if (providedAudioContext) {
      this._currentAudioContext = providedAudioContext;
    }
  }

  /**
   * Returns the current AudioContext. If no AudioContext was provided during construction
   * and no local one exists, it attempts to create a new one.
   * @returns The AudioContext instance, or null if not supported.
   */
  public async getAudioContext(): Promise<AudioContext | null> {
    if (this._currentAudioContext) {
      return this._currentAudioContext;
    }

    if (!this.localAudioContext) {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        this.localAudioContext = new AudioContext();
      } else {
        console.error("AudioContext is not supported in this browser.");
        return null;
      }
    }

    this._currentAudioContext = this.localAudioContext;
    return this._currentAudioContext;
  }

  /**
   * Resumes the AudioContext if it is in a 'suspended' state.
   */
  public async resumeAudioContext(): Promise<void> {
    if (
      this._currentAudioContext &&
      this._currentAudioContext.state === "suspended"
    ) {
      await this._currentAudioContext.resume();
    }
  }

  /**
   * Closes the locally managed AudioContext if one was created by this manager.
   * Does nothing if an AudioContext was provided externally.
   */
  public async closeLocalAudioContext(): Promise<void> {
    if (this.localAudioContext && this.localAudioContext === this._currentAudioContext && this.localAudioContext.state !== "closed") {
      await this.localAudioContext.close();
      this.localAudioContext = null;
      this._currentAudioContext = null;
    }
  }

  /**
   * Returns true if the AudioContext is managed locally by this instance, false otherwise.
   */
  public isLocalContext(): boolean {
    return this.localAudioContext === this._currentAudioContext;
  }
}
