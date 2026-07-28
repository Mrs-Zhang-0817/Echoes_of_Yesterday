import { MemoryStamp } from "../../components/MemoryStamp.js";

export const EVENT_MEMORY_RESTORED_COMPLETE =
  "EVENT_MEMORY_RESTORED_COMPLETE";

const DEFAULT_TIMING = Object.freeze({
  paperWake: 800,
  itemInterval: 500,
  progress: 2000,
  textReveal: 800,
  photoReveal: 1200,
  stamp: 1600,
});

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export class MemoryRestorationSequence {
  constructor({
    visualSystem,
    screen,
    timeScale = 1,
    clock = globalThis,
  }) {
    this.visualSystem = visualSystem;
    this.screen = screen;
    this.root = screen.element;
    this.timeScale = timeScale;
    this.clock = clock;
    this.runId = 0;
    this.state = "idle";
    this.stamp = new MemoryStamp(screen.restoredList.archiveElement);
  }

  wait(milliseconds, runId) {
    return new Promise((resolve) => {
      this.clock.setTimeout(() => {
        resolve(runId === this.runId);
      }, Math.max(0, milliseconds * this.timeScale));
    });
  }

  emit(type, detail = {}) {
    const eventDetail = {
      sequenceState: this.state,
      ...detail,
    };
    this.visualSystem.events.dispatchEvent(
      new CustomEvent(type, { detail: eventDetail }),
    );
    this.root.dispatchEvent(
      new CustomEvent(type, { detail: eventDetail, bubbles: true }),
    );
  }

  setStage(stage) {
    this.state = stage;
    this.root.dataset.restorationStage = stage;
    this.emit("memory-restoration-stage-change", { stage });
  }

  initialize({ from, restoredItems }) {
    this.root.classList.add("memory-restoration-sequence", "is-sequence-running");
    this.root.classList.remove(
      "is-paper-awake",
      "is-text-revealed",
      "is-photo-revealed",
      "is-sequence-complete",
    );
    this.root.querySelectorAll(".memory-thumbnail").forEach((thumbnail) => {
      thumbnail.classList.remove("is-restoring", "is-sequence-restored");
    });
    this.root.querySelectorAll(".memory-item").forEach((item) => {
      item.classList.remove("is-sequence-restored");
    });
    const stampElement = this.screen.restoredList.archiveElement;
    stampElement.classList.remove("is-stamped", "is-sequence-stamped");
    stampElement.textContent = "记忆已归档";
    this.visualSystem.setMemoryProgress(from, { silent: true });
    this.root.dataset.restoredItems = restoredItems.join(",");
  }

  async restoreItems(items, interval, runId) {
    for (const itemId of items) {
      if (runId !== this.runId) return false;
      const thumbnail = [...this.root.querySelectorAll(".memory-thumbnail")]
        .find((element) => element.dataset.memoryId === itemId);
      if (thumbnail) {
        thumbnail.classList.add("is-restoring");
        const item = thumbnail.closest(".memory-item");
        await this.wait(interval * .55, runId);
        if (runId !== this.runId) return false;
        thumbnail.classList.add("is-sequence-restored");
        item?.classList.add("is-sequence-restored");
      }
      if (!(await this.wait(interval * .45, runId))) return false;
    }
    return true;
  }

  async animateProgress(from, to, duration, runId) {
    const direction = to >= from ? 1 : -1;
    const steps = Math.abs(Math.round(to) - Math.round(from));
    if (steps === 0) {
      this.visualSystem.setMemoryProgress(to, { silent: true });
      return true;
    }

    const stepDuration = duration / steps;
    let value = Math.round(from);
    for (let index = 0; index < steps; index += 1) {
      if (!(await this.wait(stepDuration, runId))) return false;
      value += direction;
      this.visualSystem.setMemoryProgress(value, { silent: true });
    }
    this.visualSystem.setMemoryProgress(to, { silent: true });
    return true;
  }

  async play(data = {}) {
    const runId = ++this.runId;
    const from = clamp(data.from ?? this.visualSystem.getMemoryProgress());
    const to = clamp(data.to ?? from);
    const restoredItems = Array.isArray(data.restoredItems ?? data.items)
      ? [...(data.restoredItems ?? data.items)]
      : [];
    const baseDuration =
      DEFAULT_TIMING.paperWake +
      restoredItems.length * DEFAULT_TIMING.itemInterval +
      DEFAULT_TIMING.progress +
      DEFAULT_TIMING.textReveal +
      DEFAULT_TIMING.photoReveal +
      DEFAULT_TIMING.stamp;
    const durationScale = data.duration
      ? Math.max(.1, Number(data.duration) / baseDuration)
      : 1;
    const timing = Object.fromEntries(
      Object.entries(DEFAULT_TIMING).map(([key, value]) => [
        key,
        value * durationScale,
      ]),
    );

    this.setStage("stage-0-initialize");
    this.initialize({ from, restoredItems });
    this.emit("memory-restoration-start", { from, to, restoredItems });

    this.setStage("stage-1-paper-awakening");
    this.root.classList.add("is-paper-awake");
    if (!(await this.wait(timing.paperWake, runId))) return false;

    this.setStage("stage-2-items-restoring");
    if (!(await this.restoreItems(
      restoredItems,
      timing.itemInterval,
      runId,
    ))) return false;

    this.setStage("stage-3-clarity-restoring");
    if (!(await this.animateProgress(from, to, timing.progress, runId))) {
      return false;
    }

    this.setStage("stage-4-text-revealing");
    this.root.classList.add("is-text-revealed");
    if (!(await this.wait(timing.textReveal, runId))) return false;

    this.setStage("stage-5-photo-restoring");
    this.root.classList.add("is-photo-revealed");
    if (!(await this.wait(timing.photoReveal, runId))) return false;

    this.setStage("stage-6-archive-stamp");
    this.screen.restoredList.archiveElement.classList.add(
      "is-sequence-stamped",
    );
    this.stamp.reveal({ replay: true });
    if (!(await this.wait(timing.stamp, runId))) return false;

    this.setStage("stage-7-complete");
    this.root.classList.remove("is-sequence-running");
    this.root.classList.add("is-sequence-complete");
    this.emit(EVENT_MEMORY_RESTORED_COMPLETE, {
      from,
      to,
      restoredItems,
      emotion: data.emotion ?? "",
    });
    return true;
  }

  cancel() {
    this.runId += 1;
    this.state = "cancelled";
    this.root.classList.remove("is-sequence-running");
  }
}
