const SHARED_PROGRESS_AREA = Object.freeze({
  x: 14.8,
  y: 59.1,
  width: 26.4,
  height: 20.2,
});

const SHARED_PERCENTAGE_POSITION = Object.freeze({
  leftX: 8,
  leftY: 25,
  rightX: 73,
  rightY: 25,
});

const SHARED_BUTTONS = Object.freeze([
  Object.freeze({ x: 23.2, y: 88.1, width: 17.6, height: 8.9 }),
  Object.freeze({ x: 44.1, y: 88.1, width: 17.8, height: 8.9 }),
  Object.freeze({ x: 65.0, y: 88.1, width: 17.8, height: 8.9 }),
]);

export const ARTWORK_MEMORY_REPORT_CONFIG = Object.freeze({
  chapter_02: Object.freeze({
    chapterId: "chapter_02",
    backgroundImage: "./记忆恢复报告新底图/第二章.png",
    memoryFrom: 5,
    memoryTo: 15,
    progressArea: SHARED_PROGRESS_AREA,
    percentagePosition: SHARED_PERCENTAGE_POSITION,
    buttons: SHARED_BUTTONS,
    coverImageOverlay: null,
  }),
  chapter_03: Object.freeze({
    chapterId: "chapter_03",
    backgroundImage: "./记忆恢复报告新底图/第三章.png",
    memoryFrom: 15,
    memoryTo: 15,
    progressArea: SHARED_PROGRESS_AREA,
    percentagePosition: SHARED_PERCENTAGE_POSITION,
    buttons: SHARED_BUTTONS,
    coverImageOverlay: null,
  }),
  chapter_05: Object.freeze({
    chapterId: "chapter_05",
    backgroundImage: "./记忆恢复报告新底图/第五章.png",
    memoryFrom: 25,
    memoryTo: 35,
    progressArea: SHARED_PROGRESS_AREA,
    percentagePosition: SHARED_PERCENTAGE_POSITION,
    buttons: SHARED_BUTTONS,
    coverImageOverlay: null,
  }),
});

export const ARTWORK_CHAPTER_ORDER = Object.freeze([
  "chapter_02",
  "chapter_03",
  "chapter_05",
]);

export function getArtworkMemoryReportConfig(chapterId) {
  return ARTWORK_MEMORY_REPORT_CONFIG[chapterId] ??
    ARTWORK_MEMORY_REPORT_CONFIG.chapter_02;
}

export function getNextArtworkChapter(chapterId) {
  const index = ARTWORK_CHAPTER_ORDER.indexOf(chapterId);
  return ARTWORK_CHAPTER_ORDER[
    index < 0 ? 0 : (index + 1) % ARTWORK_CHAPTER_ORDER.length
  ];
}
