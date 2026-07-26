# 《昨日重现》UI Showcase Demo v1.0

本项目是 Mobile Landscape UI 验证实验室。当前只实现 Scene 01：Main Menu Showcase。

## 设计基准

- 逻辑画布：1280 × 720 LP
- 方向：手机横屏 16:9
- 输入：Pointer/Touch Down、Hold、Release
- 视觉：旧相册、家庭档案、泛黄纸张、照片记忆空间

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000/`。

生产构建验证：

```bash
pnpm build
```

## Scene 01 验证内容

- 五项主菜单入口与统一纸张按钮组件
- Idle / Touch Down / Touch Hold / Touch Release / Selected / Disabled
- “开始回忆”专属 Dormant Memory → Touch Awakening → Memory Confirmed → Scene Handoff
- 设置纸张面板展开/收起
- Debug 模式：Element ID、Current State、Motion ID、Touch Area
- 竖屏阻断提示与 16:9 画布缩放

## 操作提示

- 按住按钮可观察 Hold 状态
- 点击右下角“调试开启/关闭”切换触控区域与状态面板
- “继续昨日”在 Scene 01 中作为 Disabled 状态样本
- 点击“开始回忆”可验证记忆唤醒与场景交接，再返回主菜单继续测试
