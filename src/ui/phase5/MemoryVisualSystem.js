function normalizeProgress(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export class MemoryVisualSystem {
  constructor({ initialProgress = 0 } = {}) {
    this.currentProgress = normalizeProgress(initialProgress);
    this.listeners = [];
    this.events = new EventTarget();
  }

  subscribe(callback) {
    if (typeof callback !== "function") {
      throw new TypeError("MemoryVisualSystem.subscribe requires a callback.");
    }
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  emitProgressChange(value = this.currentProgress) {
    const progress = normalizeProgress(value);
    this.listeners.forEach((listener) => listener(progress));
    this.events.dispatchEvent(
      new CustomEvent("progress-change", {
        detail: { value: progress },
      }),
    );
    return this;
  }

  setMemoryProgress(value) {
    const previous = this.currentProgress;
    const progress = normalizeProgress(value);
    this.currentProgress = progress;
    console.info(
      `[MemoryVisualSystem]\nProgress: ${previous} -> ${progress}\nUpdating UI...`,
    );
    this.emitProgressChange(progress);
    return this;
  }

  getMemoryProgress() {
    return this.currentProgress;
  }
}
