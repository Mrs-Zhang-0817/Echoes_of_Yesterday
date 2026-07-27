import { UIComponent } from "../core/UIComponent.js";

export class PhotoFrame extends UIComponent {
  constructor({ id, layout, ariaLabel = "章节记忆照片区域" }) {
    super({
      id,
      className: "photo-frame",
      ariaLabel,
    });

    this.element.dataset.phase = "placeholder";
    this.setLayout({
      position: "absolute",
      overflow: "hidden",
      ...layout,
    });
  }

  setImage(source, alt = "") {
    this.element.replaceChildren();
    if (!source) {
      return this;
    }

    const image = document.createElement("img");
    image.className = "photo-frame__image";
    image.src = source;
    image.alt = alt;
    image.draggable = false;
    Object.assign(image.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    });
    this.element.appendChild(image);
    this.element.dataset.phase = "content";
    return this;
  }
}
