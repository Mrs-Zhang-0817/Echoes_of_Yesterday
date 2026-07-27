import { UIComponent } from "../core/UIComponent.js";

const ICON_LABELS = Object.freeze({
  photo: "影",
  name: "名",
  place: "地",
  object: "物",
  moment: "时",
  sound: "声",
  unknown: "？",
});

export class MemoryItem extends UIComponent {
  constructor({ id, type = "restored" }) {
    super({
      id,
      className: `memory-item memory-item--${type}`,
    });

    this.type = type;
    this.iconElement = document.createElement("span");
    this.iconElement.className = "memory-item__icon";
    this.iconElement.setAttribute("aria-hidden", "true");

    this.titleElement = document.createElement("span");
    this.titleElement.className = "memory-item__title";

    this.markElement = document.createElement("span");
    this.markElement.className = "memory-item__mark";
    this.markElement.setAttribute("aria-hidden", "true");

    this.element.append(
      this.iconElement,
      this.titleElement,
      this.markElement,
    );
  }

  setData(item) {
    const iconKey = this.type === "forgotten" ? "unknown" : item.icon;
    this.iconElement.textContent = ICON_LABELS[iconKey] ?? "记";
    this.iconElement.dataset.icon = iconKey ?? "memory";
    this.titleElement.textContent = item.title ?? "";
    this.markElement.textContent = this.type === "restored" ? "✓" : "？";
    this.element.dataset.status =
      this.type === "restored" ? item.status ?? "restored" : "forgotten";
    return this;
  }
}
