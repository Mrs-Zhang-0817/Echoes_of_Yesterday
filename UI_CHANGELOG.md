# UI Changelog

## UI v1.0 — Production Baseline

- 冻结 `main-menu.html` 主界面。
- 冻结 `memory-report-artwork.html` Artwork Memory Report。
- 冻结整张章节底图 + 动态记忆清晰度覆盖层方案。
- 冻结三张 PNG 图片按钮、统一 Button 状态机和既有 hover 效果。
- 建立 `src/ui/UIManager.js` 游戏接入层。
- 建立独立的 `src/ui/memory-report-config.json`。

### 版本规则

后续任何视觉变化必须新增版本条目（v1.1、v1.2…），不得覆盖本条记录。
纯剧情数据扩展可以保持 UI v1.0，但仍需记录关联配置和回归结果。
