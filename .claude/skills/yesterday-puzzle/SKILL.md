---
name: yesterday-puzzle
description: >
  《昨日重现》项目专用 Skill。HTML5 Canvas 拼图游戏开发 / 部署 / 调试。
  触发词：昨日重现、Ch2、拼图、拼图关卡、echoes of yesterday、妙搭部署、横屏适配。
  包含项目架构、Bug 修复清单、部署流程、测试方法。
metadata:
  type: project
  repo: Mrs-Zhang-0817/Echoes_of_Yesterday
  deploy_url: https://wcnzcbnb3bym.aiforce.cloud/app/app_17b0s9c0h90
  deploy_app_id: app_17b0s9c0h90
---

## 项目定位

《昨日重现》(Echoes of Yesterday) 是抖音大区赛黑客松作品。纯 HTML5 Canvas 第一人称阿尔茨海默叙事互动游戏，10 章约 20 分钟。

当前 Skill 覆盖 **Ch2 拼图关卡** 的完整开发 / 部署 / 调试图谱。

## 项目架构

```
抖音大区赛/
├── index.html                       # 入口（ES Module + loading 遮罩 + 横屏提示）
├── assets/images/
│   ├── room_bg.png                  # 家场景底图 (1672×941)
│   ├── desk_bg.png                  # 桌面特写 (1672×941)
│   └── puzzle_img.png               # 拼图原图 (1448×1086)
├── src/
│   ├── main.js                      # 入口：Canvas初始化、DPR适配、横屏检测、加载、启动
│   ├── core/
│   │   ├── Game.js                  # rAF 主循环
│   │   ├── Loader.js               # 图片预加载（Promise.all + 进度回调）
│   │   ├── InputManager.js         # Pointer Events 统一层
│   │   └── SceneManager.js         # 场景注册/切换/淡入淡出过渡
│   └── scenes/
│       ├── Scene_Room.js            # 家场景 — 点击桌子热区 → desk
│       ├── Scene_Desk.js            # 桌面特写 — 点击拼图热区 → puzzle
│       ├── Scene_Puzzle.js          # 3×3 拼图核心：拖拽/吸附/弹飞/褪色/粒子
│       ├── puzzleLayout.js          # 拼图布局参数 + 切片/吸附/弹飞算法
│       └── sceneUtils.js            # drawImageCover/Contain, drawPrompt, roundedRect
├── dist/                            # 部署产物（单文件 index.html + images）
│   └── index.html                   # 打包后的单文件（所有 JS 内嵌，无 ES Module）
├── docs/code-review-report.md       # 初始审查报告
├── tests/
│   ├── puzzleLayout.test.js         # 5 个单元测试 (Node --test)
│   └── manual-smoke-checklist.md    # 手动测试清单
└── .claude/skills/yesterday-puzzle/ # 本 Skill
```

## 核心技术决策

### 1. Canvas 分辨率与缩放

- **逻辑分辨率**：1280×720（16:9），所有游戏坐标以此为准
- **DPR 适配**：Canvas 物理像素 = 显示尺寸 × devicePixelRatio，用 `ctx.setTransform(dpr,0,0,dpr,0,0)` 消除模糊
- **等比缩放**：`Math.min(w/1280, h/720)` 保持比例，居中显示

```javascript
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const scale = Math.min(w / DESIGN_W, h / DESIGN_H);
  canvas.width = DESIGN_W * scale * dpr;
  canvas.height = DESIGN_H * scale * dpr;
  canvas.style.width = DESIGN_W * scale + 'px';
  canvas.style.height = DESIGN_H * scale + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
```

### 2. 横屏适配

三层策略：
1. **强制横屏遮罩**：竖屏时全屏半透明提示「请将设备旋转至横屏」
2. **orientationchange 监听**：延迟 300ms 重新计算尺寸（等浏览器完成旋转动画）
3. **CSS 防护**：`touch-action: none` + `overscroll-behavior: none` + `position: fixed` + `user-select: none`

### 3. Pointer Events

- 统一 mouse/touch/pen：一套 `pointerdown/move/up/cancel` 覆盖所有输入
- `setPointerCapture`：手指滑出 canvas 事件不丢失
- `pointercancel` 必须处理：来电/系统手势 → 重置拖拽状态
- `contextmenu` 阻止 + `gesturestart/change/end` 阻止：防止 iOS 长按菜单/手势冲突
- `touch-action: none`：CSS 层面禁用浏览器默认手势

### 4. 拼图交互参数

| 参数 | 值 | 理由 |
|------|-----|------|
| 吸附半径 | 36px | 占网格单元 20%，手感自然 |
| 拖拽阈值 | 5px | 过滤手指自然抖动，误触发率 < 1% |
| 碎片缩放 | 0.7x | 散落区碎片 70% 大小，便于区分散落/归位 |
| 弹飞动画 | 0.32s ease-out-back | 快速 + 弹性，不拖沓 |
| 高亮响应 | dt*12 渐变 | 60fps 下约 5 帧达到高亮 |

### 5. 拼图切片（防接缝）

- **问题**：原图 1448×1086 不能被 3 整除，`image.width/3 = 482.666...` 浮点坐标导致相邻切片间 1px 缝隙
- **修复**：`Math.floor(width/3)` 整数取整，前两列/行各取 floor 像素，余数全给最后一列/行
- **代码**：

```javascript
const baseW = Math.floor(imageWidth / 3);
const baseH = Math.floor(imageHeight / 3);
// 9 个 rect 全部用整数像素坐标
const rects = getSourceRects(baseW, baseH);
// piece 存储 { sourceX, sourceY, sourceW, sourceH } 整数
```

### 6. 场景过渡

- 淡入淡出 300ms（黑色遮罩 alpha 渐变）
- **关键修复**：`alpha >= 1` 和 `alpha <= 0` 使用 `>=` / `<=` 而非 `===`（浮点数永远无法精确等于 1 或 0）

## 已知 Bug 修复清单（2026-07-28）

| # | Bug | 文件 | 修复 |
|---|-----|------|------|
| 1 | 场景过渡永久卡死 | SceneManager.js | `=== 1` → `>= 1`, `=== 0` → `<= 0` |
| 2 | 拼图切片 1px 接缝 | puzzleLayout.js | 浮点 sourceX/Y → 整数像素 sourceX/Y/W/H |
| 3 | 弹飞碎片保持大尺寸 | puzzleLayout.js | eject 时恢复 `looseWidth/looseHeight` |
| 4 | 吸附半径过大 50px | puzzleLayout.js | 降低到 36px |
| 5 | 拖拽无阈值，误触多 | Scene_Puzzle.js | 添加 5px dragThreshold |
| 6 | 无横屏提示 | main.js | 创建竖屏遮罩 + orientationchange 监听 |
| 7 | DPR 不处理，Retina 模糊 | main.js | CSS 缩放 → canvas 物理像素 + setTransform(dpr) |
| 8 | iOS 长按菜单/手势冲突 | InputManager.js + index.html | contextmenu/gesturestart 阻止 + touch-action:none |
| 9 | InputManager dispatch 中 `===` 严格相等 on pointerId | InputManager.js | 已正确使用 `===`（pointerId 是整数）— 无需修改 |
| 10 | hoveredPiece 高亮太弱 | Scene_Puzzle.js | 饱和度从 0.45→0.55，glow 从 12→18 |
| 11 | Scene_Room/Desk 点击反馈公式奇怪 | Scene_Room.js, Scene_Desk.js | emphasis 改为脉冲衰减（1→0，dt*2），与呼吸分离 |
| 12 | 拼图完成无回调 | Scene_Puzzle.js + main.js | `game.onPuzzleComplete` 回调 |
| 13 | canvas 缺少 touch-action:none | index.html | `touch-action: none` |

## 部署流程

### 本地预览

```bash
cd 抖音大区赛/dist
python3 -m http.server 8080
# 打开 http://localhost:8080
```

### 部署到妙搭（Spark / Miaoda）

**准备**：打包为单文件 HTML（ES Module → 内嵌 script），图片保持外部引用。

```bash
# 1. 合并 JS（见下方脚本）
python3 /tmp/merge_final.py

# 2. 确认图片在 dist/assets/images/
ls dist/assets/images/room_bg.png dist/assets/images/desk_bg.png dist/assets/images/puzzle_img.png

# 3. 发布
cd 抖音大区赛
lark-cli apps +html-publish --app-id app_17b0s9c0h90 --path ./dist --as user

# 4. 设置公开访问（可选）
lark-cli apps +access-scope-set --app-id app_17b0s9c0h90 --scope public --require-login=false --as user
```

**部署地址**：`https://wcnzcbnb3bym.aiforce.cloud/app/app_17b0s9c0h90`

### ES Module 合并为单文件

妙搭静态托管 `Content-Type: text/plain`，不支持 `type="module"`。部署前必须合并：

```python
# 关键规则：
# 1. import 语句注释掉
# 2. export 关键字移除（保留 class/function/const）
# 3. 文件按依赖顺序拼接：Game → Loader → sceneUtils → puzzleLayout → InputManager → SceneManager → Scene_Room → Scene_Desk → Scene_Puzzle → main
```

## 测试方法

### 单元测试

```bash
cd 抖音大区赛
node --test tests/puzzleLayout.test.js
```

覆盖：碎片创建（9 块不重叠）、尺寸校验、吸附判定（范围内/外）、弹飞碰撞检测、topmost 选取。

### 本地冒烟测试

```bash
# 1. 启动本地服务器
cd dist && python3 -m http.server 8085

# 2. Headless Chrome 截图验证
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless=new --disable-gpu --no-sandbox \
  --window-size=1280,720 \
  --screenshot=/tmp/test.png \
  http://localhost:8085

# 3. Python 像素分析
python3 -c "
from PIL import Image
img = Image.open('/tmp/test.png')
p = list(img.getdata())
# 如果中心区块有 > 1000 种不同颜色 = 真实照片渲染成功
unique = len(set(p[i][:3] for i in range(0,len(p),10)))
assert unique > 1000, f'Only {unique} unique colors — broken render'
print('✅ PASS')
"
```

### 手动测试清单

参考 `tests/manual-smoke-checklist.md`

## 约束与陷阱

- **妙搭托管不支持 ES Modules**：必须打包为单文件 `<script>` 标签
- **图片必须外部引用**：3 张 PNG 共 ~8MB，base64 会超 10MB 限制
- **GitHub 图片链接有时效**：从 raw.githubusercontent.com 下载后本地缓存
- **iOS Safari 不支持 `screen.orientation.lock`**：用竖屏遮罩兜底
- **`ctx.filter` 在部分旧浏览器不支持**：饱和度效果可能失效（不影响核心玩法）
- **图片尺寸不能被 3 整除**：必须用整数像素坐标切片（`Math.floor`），否则有接缝

## 参考

- [[yesterday-code-review]] — 初始代码审查报告
- 仓库：https://github.com/Mrs-Zhang-0817/Echoes_of_Yesterday
- 策划案：https://wcnzcbnb3bym.feishu.cn/docx/ZmCId20P0oAAusx2SaAc597cnAh
- 美术资源：https://wcnzcbnb3bym.feishu.cn/wiki/TWQjwGO2AiZ2urkxL0ucZF7Hn3f
- 部署地址：https://wcnzcbnb3bym.aiforce.cloud/app/app_17b0s9c0h90
