import { UIManager } from "./core/UIManager.js";
import { FontManager, FontRole } from "./core/FontManager.js";
import { AssetRegistry, AssetCategory } from "./core/AssetRegistry.js";
import { MemoryReportScreen } from "./screens/MemoryReportScreen.js";

export function createMemoryReportApp({
  root,
  assets,
  fonts = {},
}) {
  const assetRegistry = new AssetRegistry();
  assetRegistry.register(
    AssetCategory.IMAGES,
    "memoryReportTemplate",
    assets.memoryReportTemplate,
    {
      role: "BackgroundLayer",
      crop: false,
      filter: false,
      preserveAspectRatio: true,
    },
  );

  const fontManager = new FontManager();
  fontManager
    .register(FontRole.TITLE, {
      name: "TitleFont",
      family: fonts.TitleFont ?? '"STKaiti", "KaiTi", serif',
    })
    .register(FontRole.CHAPTER, {
      name: "ChapterFont",
      family: fonts.ChapterFont ?? '"KaiTi", "STKaiti", serif',
    })
    .register(FontRole.BODY, {
      name: "BodyFont",
      family: fonts.BodyFont ?? '"SimSun", "Microsoft YaHei", serif',
    })
    .register(FontRole.HANDWRITING, {
      name: "HandwritingFont",
      family: fonts.HandwritingFont ?? '"KaiTi", "STKaiti", serif',
    })
    .register(FontRole.SYSTEM, {
      name: "SystemFont",
      family: fonts.SystemFont ?? '"Microsoft YaHei", Arial, sans-serif',
    });

  const uiManager = new UIManager({
    root,
    assetRegistry,
    fontManager,
  });

  const memoryReportScreen = new MemoryReportScreen({
    assetRegistry,
    fontManager,
  });

  uiManager.registerScreen("MemoryReport", memoryReportScreen);
  uiManager.showScreen("MemoryReport");

  return {
    uiManager,
    assetRegistry,
    fontManager,
    memoryReportScreen,
  };
}
