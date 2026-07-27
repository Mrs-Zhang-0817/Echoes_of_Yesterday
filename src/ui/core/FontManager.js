export const FontRole = Object.freeze({
  TITLE: "TitleFont",
  CHAPTER: "ChapterFont",
  BODY: "BodyFont",
  HANDWRITING: "HandwritingFont",
  SYSTEM: "SystemFont",
});

export class FontManager {
  constructor() {
    this.fonts = new Map();
  }

  register(role, descriptor) {
    if (!Object.values(FontRole).includes(role)) {
      throw new Error(`Unsupported font role: ${role}`);
    }

    this.fonts.set(role, Object.freeze({ ...descriptor }));
    return this;
  }

  get(role) {
    return this.fonts.get(role) ?? null;
  }

  resolveFamily(role) {
    return this.get(role)?.family ?? "serif";
  }

  async load(role) {
    const descriptor = this.get(role);
    if (!descriptor?.source) {
      return descriptor;
    }

    const face = new FontFace(descriptor.name, `url("${descriptor.source}")`);
    const loadedFace = await face.load();
    document.fonts.add(loadedFace);
    return descriptor;
  }

  async loadAll() {
    await Promise.all([...this.fonts.keys()].map((role) => this.load(role)));
  }
}
