import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const configPath = fileURLToPath(
  new URL("../src/ui/memory-report-config.json", import.meta.url),
);
const config = JSON.parse(readFileSync(configPath, "utf8"));

const expectedProgress = {
  chapter_01: [0, 5],
  chapter_02: [5, 15],
  chapter_03: [15, 15],
  chapter_04: [15, 25],
  chapter_05: [25, 35],
  chapter_06: [35, 45],
  chapter_07: [45, 55],
  chapter_08: [55, 65],
  chapter_09: [65, 75],
  chapter_10: [75, 100],
};

test("Chapter 01-10 use the approved memory unlock sequence", () => {
  assert.deepEqual(config.chapterOrder, Object.keys(expectedProgress));
  for (const [chapterId, [memoryFrom, memoryTo]] of Object.entries(
    expectedProgress,
  )) {
    assert.equal(config.chapters[chapterId].memoryFrom, memoryFrom);
    assert.equal(config.chapters[chapterId].memoryTo, memoryTo);
  }
});

test("every configured chapter artwork exists", () => {
  for (const chapter of Object.values(config.chapters)) {
    const relativePath = chapter.backgroundImage.replace(/^\.\//, "");
    assert.equal(existsSync(`${projectRoot}${relativePath}`), true);
  }
});

test("the shared progress overlay is lowered below report copy", () => {
  assert.equal(config.progressArea.y, 64);
});
