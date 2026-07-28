const ButtonState = Object.freeze({
  NORMAL: "normal",
  HOVER: "hover",
  PRESSED: "pressed",
  DISABLED: "disabled",
});

export class MemoryButton {
  constructor(element, {
    special = false,
    onActivate = null,
    stateKey = null,
  } = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError("MemoryButton requires an HTMLElement.");
    }

    this.element = element;
    this.special = special;
    this.onActivate = onActivate;
    this.stateKey = stateKey;
    this.pressed = false;
    this.boundHandlers = [];

    element.removeAttribute("data-state");
    element.classList.add("memory-button-v4");
    element.classList.toggle("memory-button-v4--awakening", special);
    element.dataset.buttonState = element.matches(":disabled")
      ? ButtonState.DISABLED
      : ButtonState.NORMAL;

    if (!element.matches(":disabled")) {
      this.bind();
    }
  }

  setState(state) {
    this.element.dataset.buttonState = state;
    this.element.setAttribute("aria-busy", String(state === ButtonState.PRESSED));
    return this;
  }

  setDisabled(disabled) {
    const isDisabled = Boolean(disabled);
    this.element.setAttribute("aria-disabled", String(isDisabled));
    this.element.style.pointerEvents = isDisabled ? "none" : "auto";
    this.element.tabIndex = isDisabled ? -1 : 0;
    this.pressed = false;
    return this.setState(
      isDisabled ? ButtonState.DISABLED : ButtonState.NORMAL,
    );
  }

  isDisabled() {
    return this.element.getAttribute("aria-disabled") === "true";
  }

  listen(type, handler) {
    this.element.addEventListener(type, handler);
    this.boundHandlers.push([type, handler]);
  }

  bind() {
    this.listen("pointerenter", (event) => {
      if (event.pointerType !== "touch" && !this.pressed) {
        this.setState(ButtonState.HOVER);
      }
    });
    this.listen("pointerleave", () => {
      this.pressed = false;
      this.setState(ButtonState.NORMAL);
    });
    this.listen("pointerdown", (event) => {
      if (this.isDisabled()) return;
      this.pressed = true;
      this.element.setPointerCapture?.(event.pointerId);
      this.setState(ButtonState.PRESSED);
    });
    this.listen("pointerup", (event) => {
      if (this.isDisabled()) return;
      if (!this.pressed) return;
      this.pressed = false;
      const bounds = this.element.getBoundingClientRect();
      const valid =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      this.setState(
        event.pointerType === "touch" ? ButtonState.NORMAL : ButtonState.HOVER,
      );
      if (!valid) return;
      if (this.stateKey) {
        sessionStorage.setItem("yesterday:last-control", this.stateKey);
      }
      this.element.dispatchEvent(
        new CustomEvent("memory-button:activate", { bubbles: true }),
      );
      this.onActivate?.(this);
    });
    this.listen("pointercancel", () => {
      this.pressed = false;
      this.setState(ButtonState.NORMAL);
    });
    this.listen("focus", () => this.setState(ButtonState.HOVER));
    this.listen("blur", () => this.setState(ButtonState.NORMAL));
    this.listen("keydown", (event) => {
      if (this.isDisabled()) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.setState(ButtonState.PRESSED);
    });
    this.listen("keyup", (event) => {
      if (this.isDisabled()) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      this.setState(ButtonState.HOVER);
      if (this.stateKey) {
        sessionStorage.setItem("yesterday:last-control", this.stateKey);
      }
      this.onActivate?.(this);
    });
  }

  destroy() {
    this.boundHandlers.forEach(([type, handler]) => {
      this.element.removeEventListener(type, handler);
    });
    this.boundHandlers = [];
  }
}

export { ButtonState };
