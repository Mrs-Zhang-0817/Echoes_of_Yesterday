import { MemoryButton } from "./components/Button.js";
import { PaperLayer } from "./components/PaperLayer.js";
import { MemoryStamp } from "./components/MemoryStamp.js";
import { HoverEffects } from "./animations/HoverEffects.js";
import { MemoryPageTransition } from "./animations/PageTransition.js";

export function initializeMemoryReportInteractions(app) {
  const screen = app.memoryReportScreen;
  const transition = new MemoryPageTransition();
  new HoverEffects(document).mount();

  new PaperLayer(screen.leftPanel.element, {
    depth: "content",
    rotation: -0.15,
  });
  new PaperLayer(screen.centerPanel.element, {
    depth: "middle",
    rotation: 0.12,
  });
  new PaperLayer(screen.rightPanel.element, {
    depth: "content",
    rotation: 0.18,
  });
  new PaperLayer(screen.photoFrame.element, {
    depth: "photo",
    rotation: -0.7,
  });

  const photoData = screen.chapterData?.photo ?? {};
  screen.photoFrame.element.tabIndex = 0;
  screen.photoFrame.element.dataset.photoNote =
    photoData.note ?? `${screen.chapterData?.date ?? ""} · 旧日留影`;
  if (screen.chapterData?.restoredMemory?.length) {
    screen.photoFrame.element.classList.add("is-restored");
  }

  const stampElement = screen.restoredList.archiveElement;
  const stamp = new MemoryStamp(stampElement);
  stamp.reveal();

  screen.buttons.forEach((button, index) => {
    button.element.style.pointerEvents = "auto";
    button.element.tabIndex = 0;
    button.element.setAttribute("aria-disabled", "false");
    new MemoryButton(button.element, {
      special: index === 0,
      stateKey: button.id,
      onActivate: () => {
        if (index === 0) {
          const nextChapter =
            screen.chapterData?.chapterId === "chapter_test"
              ? "chapter_01"
              : "chapter_test";
          sessionStorage.setItem("yesterday:chapter-selection", nextChapter);
          transition.navigate(
            `./memory-report.html?chapter=${encodeURIComponent(nextChapter)}`,
          );
        }
        if (index === 1) stamp.reveal({ replay: true });
        if (index === 2) transition.navigate("./index.html");
      },
    });
  });

  window.addEventListener("pagehide", () => {
    sessionStorage.setItem(
      "yesterday:last-report",
      screen.chapterData?.chapterId ?? "chapter_01",
    );
  });
}
