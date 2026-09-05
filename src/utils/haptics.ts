class HapticsManager {
  private enabled: boolean = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public light() {
    if (!this.enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate(20);
    } catch {
      // Ignored
    }
  }

  public error() {
    if (!this.enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate([25, 40, 25]);
    } catch {
      // Ignored
    }
  }

  public success() {
    if (!this.enabled || typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
    try {
      navigator.vibrate([40, 50, 60, 50, 100]);
    } catch {
      // Ignored
    }
  }
}

export const hapticsManager = new HapticsManager();
