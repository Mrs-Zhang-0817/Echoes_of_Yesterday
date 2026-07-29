# 《昨日重现 UI Showcase Demo Specification v1.0》

**Mobile Landscape UI Validation Demo**

版本：v1.0  
目标平台：Mobile Landscape  
逻辑画布：1280×720 LP  
产品性质：独立UI验证Demo / UI实验室  
适用对象：UI设计师、动画设计师、程序开发、QA与项目负责人  

---

# 1 Demo目标

## 1.1 Demo定位

《昨日重现 UI Showcase Demo v1.0》是一套可独立打开、触摸和验收的移动横屏UI实验室。

它不是：

- 完整游戏。
- 正式章节。
- 剧情演示。
- 玩法原型。
- 商店、活动或宣传页面。

它只用于验证：

1. UI视觉是否符合《UI Visual Bible v1.1》。
2. 触控行为与状态转换是否符合《UI Interaction Bible v1.0》。
3. 动态反馈与页面转场是否符合《UI Motion Bible v1.0》。
4. 组件能否作为正式游戏UI开发模板复用。
5. 手机横屏下的阅读、触控和信息密度是否达到商业独立游戏品质。

## 1.2 核心继承规则

| 继承来源 | Showcase必须遵守的内容 |
|---|---|
| Visual Bible v1.1 | 1280×720 LP、16:9横屏、Safe Area、字体、组件尺寸、Hitbox、材质、色彩与Design Token |
| Interaction Bible v1.0 | Idle、Touch Down、Touch Hold、Touch Release、Selected、Disabled、Completed及其转换逻辑 |
| Motion Bible v1.0 | Memory Motion Language、Motion Level、Timing Level、Interrupt Rule、反馈层级与页面转场语义 |

Showcase不得：

| 禁止项 | 说明 |
|---|---|
| 修改视觉风格 | 不增加科技、现代App、商城或网页视觉 |
| 修改尺寸 | 不重新定义Button、Panel、字体、Hitbox或Safe Area |
| 降低状态复杂度 | 不因Demo用途省略必要状态 |
| 重做组件 | 不建立与Bible并行的第二套组件 |
| 开发剧情 | 只使用中性、最小化的测试内容 |
| 模拟完整游戏 | 不制作章节玩法、对白、探索或结局 |

## 1.3 验证问题

每次Demo评审必须回答：

| 问题 | 通过判断 |
|---|---|
| 第一眼是否像商业独立游戏？ | 不像网页、App模板或原生控件集合 |
| 触摸是否像接触旧物？ | 纸张、照片、档案的反馈具有重量与材质 |
| 记忆是否真正“苏醒”？ | 关键入口与恢复过程具备发现、唤醒、恢复、确认语义 |
| 手机横屏是否舒适？ | 信息清晰、触控准确、手指不遮挡关键内容 |
| 团队是否能据此开发正式UI？ | 组件、状态、Motion与页面流程均可复用和追踪 |

## 1.4 Demo完成定义

只有以下内容全部可操作并通过验收，Demo才算完成：

- Scene 01 Main Menu Showcase。
- Scene 02 Memory Archive Showcase。
- Scene 03 Photo Reconstruction Showcase。
- Scene 04 Chapter Recovery Report Showcase。
- Component Gallery。
- Interaction Debug Mode。
- Motion Validation Lab。
- 全量QA Checklist。

---

# 2 页面结构

## 2.1 页面地图

| Page ID | 页面名称 | 用途 | 是否属于正式游戏 |
|---|---|---|---|
| SHOWCASE_HOME | Showcase入口页 | 选择测试场景、Gallery、Motion Lab与Debug设置 | 否 |
| SCENE_01_MENU | Main Menu Showcase | 验证主菜单与按钮层级 | 模拟正式UI |
| SCENE_02_ARCHIVE | Memory Archive Showcase | 验证档案三栏、节点与详情抽屉 | 模拟正式UI |
| SCENE_03_PHOTO | Photo Reconstruction Showcase | 验证照片碎片、Drop与Recovered | 模拟正式UI |
| SCENE_04_REPORT | Chapter Recovery Report Showcase | 验证报告阅读、滚动与继续 | 模拟正式UI |
| COMPONENT_GALLERY | Component Gallery | 集中比较组件与状态 | 否 |
| MOTION_LAB | Motion Validation Lab | 单独触发关键Motion | 否 |
| QA_SUMMARY | QA Summary | 汇总测试结果、缺陷和签署状态 | 否 |

## 2.2 Showcase入口页

Showcase入口页是测试工具页面，不进入正式游戏流程。

必须包含：

| 区域 | 内容 |
|---|---|
| 标题区 | UI Showcase Demo v1.0、1280×720 LP、当前Bible版本 |
| 场景入口 | Scene 01–04 |
| 工具入口 | Component Gallery、Motion Validation Lab、QA Summary |
| Debug控制 | Debug Mode开关、Hitbox显示、触点显示、状态日志显示 |
| 环境说明 | “此页面仅用于UI验证，不属于正式游戏” |

入口页仍使用既有旧档案视觉体系，但不允许它被误认为正式主菜单。

## 2.3 全局导航

| 行为 | 规则 |
|---|---|
| 进入测试场景 | 从SHOWCASE_HOME选择目标场景 |
| 返回 | 返回当前页面的Showcase来源页，不进入正式游戏 |
| 重置场景 | 恢复该测试场景的默认状态与测试数据 |
| 下一测试 | 按Scene 01→02→03→04→Gallery→Motion Lab顺序前进 |
| Debug Mode | 可在任意Showcase页面启用；不改变正式UI状态定义 |
| QA记录 | 每项测试结果写入本次Showcase会话 |

## 2.4 数据隔离

Showcase必须使用独立测试数据。

| 数据类型 | 规则 |
|---|---|
| 测试存档 | 仅用于切换“首次进入 / 已有存档”状态 |
| 记忆节点 | 使用固定Unknown、Partial、Recovered样本 |
| 照片碎片 | 使用固定合法位置与错误位置 |
| 章节结果 | 使用固定恢复列表、未知记忆与清晰度样本 |
| 正式游戏存档 | 禁止读取、覆盖或删除 |
| 正式游戏入口 | Showcase内任何按钮都不得进入正式游戏 |

---

# 3 测试场景

## 3.1 Scene 01 — Main Menu Showcase

### 3.1.1 验证目标

验证完整移动横屏主菜单的：

- 视觉层级。
- 六个入口的状态。
- 普通按钮与记忆唤醒按钮差异。
- 首次进入与已有存档两套流程。
- 触摸取消、误触与连续点击保护。
- Scene Handoff动态语义。

### 3.1.2 必备元素

| Element ID | 元素 | 类型 | 默认状态 |
|---|---|---|---|
| MENU_TITLE | 游戏标题“昨日重现” | Display | Stable |
| BTN_START_MEMORY | 开始回忆 | Primary / Memory Awakening Button | Idle或Selected测试态 |
| BTN_CONTINUE | 继续昨日 | Primary或Secondary | 依据测试存档切换 |
| BTN_CHAPTERS | 章节选择 | Secondary | Idle |
| BTN_ARCHIVE | 记忆档案 | Bottom或Icon Button | Idle |
| BTN_SETTINGS | 设置 | Icon Button | Idle |
| MENU_DECOR | 照片、磁带、便笺与相册边缘 | Decoration | Non-interactive |

### 3.1.3 主菜单测试数据模式

| Mode ID | 条件 | Primary按钮 | 特殊要求 |
|---|---|---|---|
| MENU_FIRST_ENTRY | 无测试存档 | 开始回忆 | 继续昨日Disabled |
| MENU_HAS_SAVE | 有测试存档 | 继续昨日 | 开始回忆降为次级入口 |
| MENU_LOCKED | 模拟Action Lock | 当前已触发按钮 | 其他入口不接受重复触发 |
| MENU_DISABLED_SET | 模拟入口条件不足 | 指定按钮Disabled | 可验证Disabled视觉与无反馈 |

### 3.1.4 Button状态矩阵

每种按钮至少有一个可独立进入以下状态的测试实例。

| 状态 | 触发方式 | 必查反馈 | 退出方式 |
|---|---|---|---|
| Idle | 场景重置或状态选择 | 旧纸、阴影、边缘与图标稳定 | Finger Down |
| Touch Down | 手指按入Hitbox | 纸张压入、阴影收紧、对象归属明确 | Release、移出或Hold |
| Touch Hold | 持续触摸测试 | 保持关注，不无限增强 | Release或取消 |
| Touch Release | 在有效区释放 | 一次确认反馈与Action Trigger | 进入目标状态或Transition Lock |
| Selected | Debug控制指定或真实选择 | 稳定Selected视觉；再按时以Selected为基线 | 选择其他对象或关闭上下文 |
| Disabled | 状态面板指定 | 不进入Pressed、不播放可点击反馈 | 恢复Requirement |

### 3.1.5 “开始回忆”Motion Flow

| Test Step | Interaction State | Motion State | 验收重点 |
|---|---|---|---|
| 1 | Idle | Dormant Memory | 是旧纸入口，不持续闪烁或催促 |
| 2 | Touch Down | Touch Awakening | 纸张压入，局部暖光与记忆显影开始 |
| 3 | Touch Hold | Awakening Hold | 显影保持，不无限变亮 |
| 4A | Invalid Release | Recede to Dormant | 完整撤销，不触发Scene Handoff |
| 4B | Valid Release | Memory Confirmed | 显影收束、确认明确、只触发一次 |
| 5 | Transition Lock | Scene Handoff | 由记忆来源接管画面，不是普通Fade |
| 6 | Showcase Target | Handoff Complete | 进入测试用场景占位页，不进入正式游戏 |

### 3.1.6 普通按钮与记忆唤醒按钮对比

Scene 01必须提供并排验收入口。

| 维度 | 普通按钮 | 开始回忆 |
|---|---|---|
| Touch Down | 纸张压入 | 纸张压入 + 记忆开始响应 |
| Hold | 保持Pressed或普通Hold | 显影保持 |
| Release | 常规确认 | Memory Confirmed |
| 转场 | 页面级操作 | 叙事级Scene Handoff |
| Motion Level | Component / Page | Narrative |
| 重复点击 | Action Lock | 更严格的单次唤醒保护 |

### 3.1.7 主菜单测试用例

| Test ID | 操作 | 预期结果 |
|---|---|---|
| MENU-T01 | 有效点击普通按钮 | 只触发一次目标动作 |
| MENU-T02 | Down后移出Hitbox再Release | 回Idle或原Selected，不触发 |
| MENU-T03 | 连续快速点击开始回忆 | 只出现一次Memory Confirmed与Scene Handoff |
| MENU-T04 | 点击Disabled继续昨日 | 无Pressed、无跳转 |
| MENU-T05 | 启用测试存档 | 继续昨日成为Primary |
| MENU-T06 | Scene Handoff中点击其他入口 | 所有新Action被Transition Lock拒绝 |
| MENU-T07 | 系统中断模拟 | 未确认触摸取消，已确认入口保留一致状态 |

---

## 3.2 Scene 02 — Memory Archive Showcase

### 3.2.1 验证目标

验证：

- 左分类栏固定结构。
- 中央关系图移动与节点选择。
- 右侧详情抽屉覆盖式展开。
- Unknown、Partial、Recovered三态。
- 触摸所有权与手势冲突。
- 分类、节点、抽屉及浏览态保存。

### 3.2.2 页面结构

| Region ID | 区域 | 继承布局 | 主要交互 |
|---|---|---|---|
| ARCHIVE_CATEGORIES | 左分类栏 | Visual Bible v1.1定义的移动横屏尺寸 | Tap Tab、溢出时垂直Swipe |
| ARCHIVE_GRAPH | 中央关系图 | 固定主工作区 | Tap Node、Drag空白平移、可选Pinch |
| ARCHIVE_DETAIL | 右详情抽屉 | 折叠索引 / 展开覆盖 | 垂直Swipe、关闭、照片查看 |
| ARCHIVE_BOTTOM | 底部操作区 | Interactive Safe Area内 | 返回、重置测试 |

### 3.2.3 分类样本

必须包含：

- 人物。
- 地点。
- 时刻。
- 情感。
- 生活痕迹。

默认展示“人物”，其余分类至少各提供一个测试节点。

### 3.2.4 Memory Node样本

| Node ID | 状态 | 内容样本 | 必查表现 |
|---|---|---|---|
| NODE_UNKNOWN_01 | Unknown | ？？？ | 沉默、隐藏、无完整连接 |
| NODE_PARTIAL_01 | Partial | 丫丫 / 部分恢复 | 局部显影、断续连接 |
| NODE_RECOVERED_01 | Recovered | 第一天上学 | 清晰照片、稳定连接、归档标记 |
| NODE_COMPLETED_SELECTED | Recovered + Selected | 当前详情节点 | Completed与Selected可同时存在 |

### 3.2.5 Node Interaction流程

| Step | 操作 | 状态变化 | 页面结果 |
|---|---|---|---|
| 1 | Finger Down on Node | Node → Touch Down | 关系图暂不平移 |
| 2A | 小范围移动后有效Release | Node → Selected | 抽屉展开并显示该节点 |
| 2B | 超过平移阈值 | 取消Node Tap | 转为关系图平移 |
| 3 | 选择另一Node | 旧Node回业务状态；新Node Selected | 抽屉内容更新 |
| 4 | Tap关系图空白 | 清除Selected | 关闭详情抽屉 |
| 5 | Tap抽屉关闭Icon | 清除Selected | 抽屉收回，视口保持 |

### 3.2.6 详情抽屉字段

| 字段 | 测试内容 |
|---|---|
| 照片 | 与节点状态匹配的Unknown、Partial或Recovered照片 |
| 姓名 | 完整、局部或隐藏 |
| 关系 | 父女、地点关联或未知 |
| 关联记忆 | 2–4条固定样本 |
| 恢复程度 | 与Node状态一致 |

### 3.2.7 关系图测试

| Test ID | 操作 | 预期结果 |
|---|---|---|
| ARCH-T01 | Tap Partial Node | Selected并展开详情 |
| ARCH-T02 | Tap Recovered Node | 显示完整档案，不重复播放Recover |
| ARCH-T03 | Tap Unknown Node | 按Requirement显示发现反馈或保持Disabled |
| ARCH-T04 | 从空白区Drag | 平移视口，不改变节点数据 |
| ARCH-T05 | 从Node开始Drag并超过阈值 | 取消Tap，转为视口平移 |
| ARCH-T06 | 切换分类 | 清除Selected、关闭抽屉、更新关系图 |
| ARCH-T07 | 抽屉内Swipe | 只滚动抽屉内容 |
| ARCH-T08 | 打开抽屉后返回 | 优先关闭抽屉，不离开页面 |
| ARCH-T09 | 离开后重新进入 | 恢复规定的分类与浏览态 |

---

## 3.3 Scene 03 — Photo Reconstruction Showcase

### 3.3.1 验证目标

验证照片恢复不是普通拼图，而是一段完整的记忆重构：

1. 玩家辨认破损证据。
2. 拿起并整理碎片。
3. 获得合法吻合反馈。
4. 看到边缘和内容被修复。
5. 进入稳定的Recovered状态。

### 3.3.2 页面元素

| Element ID | 元素 | 作用 |
|---|---|---|
| PHOTO_BASE_BROKEN | 破损照片底板 | 显示缺失区域与合法Drop位置 |
| PHOTO_FRAGMENT_A–F | 照片碎片 | Drag测试 |
| DROP_ZONE_VALID_A–F | 合法Drop区 | 提供吻合反馈 |
| DROP_ZONE_INVALID | 错误Drop测试区 | 验证拒绝与回位 |
| PHOTO_RECOVERED | 完整照片 | Recovered稳定状态 |
| PHOTO_STATUS | 状态题签 | Before Memory / Memory Reconstruction / Recovered |
| BTN_RESET_PHOTO | 重置照片测试 | 恢复固定初始状态 |

### 3.3.3 照片阶段

| 阶段 | 页面状态 | 允许操作 | 数据状态 |
|---|---|---|---|
| Before Memory | 破损、褪色、缺失 | Tap查看、开始Drag | 未提交 |
| Memory Reconstruction | 碎片可整理 | Drag、合法Drop、错误Drop、取消 | 临时结果 |
| Final Condition Met | 最后一块合法落位 | 禁止新Drag，开始Restore Motion | 等待完成确认 |
| Recovered | 边缘、色彩、归档稳定 | Tap查看完整照片 | Completed |

### 3.3.4 Drag测试

| Test ID | 操作 | 预期反馈 |
|---|---|---|
| PHOTO-T01 | Down碎片，小范围移动，Release | 作为Tap或回原位，不误判Drag |
| PHOTO-T02 | Drag进入合法Drop区 | 目标边缘出现吻合反馈 |
| PHOTO-T03 | 在合法区Release | 碎片落定，写入临时正确位置 |
| PHOTO-T04 | Drag进入错误Drop区 | 不显示合法吻合 |
| PHOTO-T05 | 错误区Release | 碎片回上一个有效位置，不爆炸、不强烈抖动 |
| PHOTO-T06 | Drag出画布或系统中断 | 恢复最近稳定位置 |
| PHOTO-T07 | 最后一块合法Drop | 进入Final Condition Met，只触发一次Restore |
| PHOTO-T08 | Recovered后再次触摸 | 可聚焦查看，不重复恢复或奖励 |

### 3.3.5 Photo Restore验证

必须能分别观察：

| Motion Phase | 验收内容 |
|---|---|
| Fragment Settle | 碎片落位具有纸张重量，不是吸铁石瞬移 |
| Edge Restore | 裂缝由明显到收束，不使用科技缝合 |
| Image Reveal | 关键人物或物件先清晰 |
| Color Restore | 色彩从记忆中心恢复，保留年代感 |
| Archive Confirm | Completed标记落定，主运动停止 |

### 3.3.6 恢复不是普通拼图

以下条件必须同时满足：

- 正确Drop反馈来自照片边缘与内容吻合。
- 错误Drop不惩罚永久进度。
- 恢复过程包含边缘、影像、色彩和归档四层语义。
- Recovered照片保持旧照片质感，不变成现代高清图片。
- 完成后动态停止，不循环展示“成功”。

---

## 3.4 Scene 04 — Chapter Recovery Report Showcase

### 3.4.1 验证目标

验证报告页能够在手机横屏首屏中清晰呈现：

- 章节结果。
- 记忆清晰度变化。
- 恢复记忆列表。
- 未知记忆。
- 继续昨日按钮。

### 3.4.2 必备元素

| Element ID | 元素 | 测试内容 |
|---|---|---|
| REPORT_HEADER | 章节标题与日期章 | 固定测试章节 |
| REPORT_SUMMARY | 恢复结果总结 | “今日回忆已归档” |
| REPORT_PROGRESS | 清晰度前后值与进度条 | 固定测试变化 |
| REPORT_RECOVERED_LIST | 恢复记忆列表 | 至少6条，首屏显示4条 |
| REPORT_UNKNOWN_LIST | 未知记忆列表 | 至少4条，首屏显示3条 |
| BTN_CONTINUE_YESTERDAY | 继续昨日 | Primary / Memory Awakening Button |
| BTN_VIEW_ARCHIVE | 查看档案 | Secondary或Bottom Button |
| BTN_REPORT_BACK | 返回 | Bottom或Icon Button |

### 3.4.3 阅读流程

| 顺序 | 区域 | 验收 |
|---|---|---|
| 1 | 结果 | 首先看到章节完成与清晰度变化 |
| 2 | 恢复内容 | 至少3条无需滚动即可读取 |
| 3 | 未知记忆 | 至少2条无需滚动即可读取 |
| 4 | 下一步 | 完整“继续昨日”按钮始终清晰可触 |

### 3.4.4 滚动测试

| Test ID | 操作 | 预期结果 |
|---|---|---|
| REPORT-T01 | Swipe恢复列表 | 只滚动中部列表 |
| REPORT-T02 | Swipe未知列表 | 只滚动右侧列表 |
| REPORT-T03 | 列表滚动中Tap条目 | 按Interaction Bible停止或选择，不误触底部按钮 |
| REPORT-T04 | 列表到边界 | 停止在合法范围，不出现网页式弹性空白 |
| REPORT-T05 | 进入档案后返回 | 恢复报告滚动位置与阅读状态 |

### 3.4.5 继续昨日

| 状态 | 要求 |
|---|---|
| 结果未提交 | Disabled，不允许提前进入下一测试页 |
| 结果已提交 | Idle，可执行记忆唤醒按钮流程 |
| Touch Down | 触碰旧纸并产生记忆响应 |
| Valid Release | Memory Confirmed与Action Lock |
| Scene Handoff | 进入Showcase下一场景占位，不进入正式章节 |
| 重复点击 | 不重复写入章节结果或触发多个Handoff |

### 3.4.6 报告测试用例

| Test ID | 操作 | 预期结果 |
|---|---|---|
| REPORT-T06 | 打开报告 | 不是普通Fade；报告纸页按档案逻辑建立 |
| REPORT-T07 | Tap查看档案 | 携带本章新增节点上下文 |
| REPORT-T08 | 从档案返回 | 报告浏览态恢复 |
| REPORT-T09 | Tap继续昨日 | 只负责前进，不首次写入章节结果 |
| REPORT-T10 | Handoff失败模拟 | 返回报告Stable状态并解除Action Lock |

---

## 3.5 Component Gallery

### 3.5.1 Gallery目标

集中展示同一组件在不同状态下的视觉、交互和Motion差异，供团队直接比对。

Gallery不得取代真实场景验证。所有组件必须同时在对应Scene中通过测试。

### 3.5.2 Gallery结构

| 区域 | 内容 |
|---|---|
| 左侧组件索引 | Button、Panel、Photo Card、Memory Node、Tab、Icon |
| 中央展示区 | 当前组件的多状态样本 |
| 右侧规范区 | Element ID、状态、Motion、尺寸引用、Hitbox引用 |
| 底部控制 | 状态切换、Motion触发、重置、Debug开关 |

### 3.5.3 组件状态要求

| 组件 | Idle | Touch Down | Release | Disabled | Completed |
|---|---|---|---|---|---|
| Primary Button | 必须 | 必须 | 必须 | 必须 | 以完成入口或锁定状态展示 |
| Secondary Button | 必须 | 必须 | 必须 | 必须 | 若不适用，标注N/A并说明 |
| Bottom Button | 必须 | 必须 | 必须 | 必须 | 若不适用，标注N/A并说明 |
| Icon Button | 必须 | 必须 | 必须 | 必须 | 完成类Icon需展示 |
| Panel | Stable | Open过程中的接触锁定 | Open/Close完成 | 不可操作状态 | 归档Panel状态 |
| Photo Card | 普通照片 | 按下 | 聚焦确认 | 不可查看 | Recovered |
| Memory Node | 按业务态展示 | 按下 | Selected | Unknown Disabled样本 | Recovered |
| Tab | Idle | 按下 | Selected | Disabled | 已完成分类可选样本 |
| Icon | Idle | 按下 | 确认 | Disabled | Completed标记 |

### 3.5.4 Button Gallery

必须同时展示：

- Primary Button。
- Secondary Button。
- Bottom Button。
- Icon Button。
- 普通按钮。
- 记忆唤醒按钮。

记忆唤醒按钮必须提供Dormant Memory、Touch Awakening、Memory Confirmed、Scene Handoff四个独立触发点。

### 3.5.5 Panel Gallery

必须展示：

- Primary Sheet。
- Archive Card。
- Pinned Note。
- Modal Folder。
- Open。
- Stable。
- Close。
- Disabled Interaction。

### 3.5.6 Photo Card Gallery

必须展示：

- 普通照片。
- 破损照片。
- Partial照片。
- Recovered照片。
- Selected照片。
- Disabled照片。

### 3.5.7 Memory Node Gallery

必须展示：

- Unknown。
- Partial。
- Recovered。
- Unknown + Selected。
- Partial + Selected。
- Recovered + Selected。
- Recovered + Completed。

### 3.5.8 Tab与Icon Gallery

必须验证：

- 相邻Hitbox不重叠。
- Selected与Touch Down视觉不混淆。
- Disabled不产生可点击反馈。
- Icon视觉尺寸与88×88 LP Hitbox关系清晰。

---

## 3.6 Interaction Debug Mode

### 3.6.1 定位

Interaction Debug Mode是Showcase专用验证层，不属于正式游戏UI。

它不能：

- 进入正式游戏。
- 修改正式游戏存档。
- 改变组件视觉标准。
- 在关闭后留下调试标记。

### 3.6.2 Debug显示字段

| Debug字段 | 内容 |
|---|---|
| Element ID | 当前触点或选中对象的唯一ID |
| Type | Button、PhotoCard、MemoryNode、Tab、Icon、Panel等 |
| State | 当前Interaction State |
| Business State | Unknown、Partial、Recovered、Completed等 |
| Motion ID | 当前或最近触发的Motion |
| Motion Level | Narrative、Page、Component、Ambient |
| Touch Target | 当前触摸所有权归属 |
| Hitbox | 实际触控边界 |
| Visual Bounds | 组件视觉边界 |
| Requirement | 当前启用条件及结果 |
| Action Target | 有效Release后的目标 |
| Lock State | Normal、Action Lock、Transition Lock |
| Data Write | 本次动作允许写入的测试数据 |

### 3.6.3 Debug Overlay层级

| 层 | 显示内容 | 规则 |
|---|---|---|
| D1 | Hitbox边框 | 不改变实际Hitbox |
| D2 | Visual Bounds | 与Hitbox使用不同标识 |
| D3 | Touch Point与路径 | 只记录当前测试触点 |
| D4 | Element信息卡 | 放置在Safe Area内，不遮挡当前对象 |
| D5 | State / Motion日志 | 可折叠、可清空 |

### 3.6.4 Hitbox检查

Debug Mode必须能发现：

- Hitbox小于Bible标准。
- 相邻Hitbox重叠。
- Hitbox进入系统Inset。
- 装饰元素意外可触。
- 视觉对象与Touch Target不一致。
- 抽屉、列表与关系图的触摸所有权冲突。

### 3.6.5 状态日志

每次交互至少记录：

| Log字段 | 示例语义 |
|---|---|
| Sequence ID | 一次触摸序列 |
| Element ID | 被触摸对象 |
| Previous State | 触摸前状态 |
| Input | Down、Hold、Move、Release、Cancel |
| Next State | 状态转换结果 |
| Motion ID | 被触发Motion |
| Action Result | Valid、Invalid、Locked、Cancelled |
| Data Result | None、Browse State、Temporary、Completed |

---

## 3.7 Motion Validation Lab

### 3.7.1 目标

让每个关键Motion可以脱离完整流程单独触发、重置、重复观察和对比。

### 3.7.2 必测Motion

| Motion ID组 | 动画 | 必测状态 |
|---|---|---|
| MOTION_BUTTON_PRESS | Button Press | Idle→Touch Down→Release / Cancel |
| MOTION_MEMORY_REVEAL | Memory Reveal | Dormant→Awakening→Confirmed |
| MOTION_PANEL_OPEN | Panel Open | Closed→Entering→Stable |
| MOTION_PANEL_CLOSE | Panel Close | Stable→Closing→Closed |
| MOTION_PHOTO_RESTORE | Photo Restore | Broken→Reconstruction→Recovered |
| MOTION_NODE_RECOVER | Node Recover | Unknown→Partial→Recovered |
| MOTION_PAGE_TRANSITION | Page Transition | Source→Transition Lock→Target |
| MOTION_WAITING | Loading / Waiting | Start→Active→Success / Failure / Cancel |

### 3.7.3 Motion Lab控制

| 控制 | 作用 |
|---|---|
| Play | 从Source State触发一次 |
| Pause at State | 停在指定Interaction或Motion阶段 |
| Reset | 回到规范定义的Source State |
| Trigger Cancel | 测试可逆与取消路径 |
| Trigger System Interrupt | 测试后台/中断恢复 |
| Trigger Failure | 测试目标失败与回退 |
| Reduced Motion | 比较标准与弱化动态 |
| Audio On/Off | 验证无声音时仍可理解 |
| Haptic On/Off | 验证无触感时仍可理解 |

### 3.7.4 Motion比较

必须提供以下并排或连续对比：

| 对比项 | 验证问题 |
|---|---|
| 普通Button vs 记忆唤醒Button | 叙事层级是否明显不同 |
| Panel Open vs 普通Fade | 是否具有档案来源与方向 |
| Broken Photo vs Recovered Photo | 是否完成“修复后稳定” |
| Partial Node vs Recovered Node | 连接与归档是否清晰 |
| Standard Motion vs Reduced Motion | 必要状态反馈是否都被保留 |

---

# 4 UI组件清单

## 4.1 核心组件

| Component ID | 组件 | Showcase页面 | 必测状态 |
|---|---|---|---|
| CMP_BTN_PRIMARY | Primary Button | Scene 01、Scene 04、Gallery | Idle、Down、Hold、Release、Disabled、Selected |
| CMP_BTN_MEMORY | Memory Awakening Button | Scene 01、Scene 04、Motion Lab | Dormant、Awakening、Confirmed、Handoff |
| CMP_BTN_SECONDARY | Secondary Button | Scene 01、Gallery | Idle、Down、Release、Disabled、Selected |
| CMP_BTN_BOTTOM | Bottom Button | Scene 01–04、Gallery | Idle、Down、Release、Disabled |
| CMP_BTN_ICON | Icon Button | Scene 01–04、Gallery | Idle、Down、Release、Disabled |
| CMP_PANEL_PRIMARY | Primary Sheet | Scene 02、Scene 04、Gallery | Enter、Stable、Exit |
| CMP_PANEL_DRAWER | Detail Drawer | Scene 02、Gallery | Closed、Open、Stable、Close |
| CMP_PHOTO_CARD | Photo Card | Scene 02、Scene 03、Gallery | Normal、Broken、Partial、Recovered、Selected |
| CMP_MEMORY_NODE | Memory Node | Scene 02、Gallery | Unknown、Partial、Recovered、Selected、Completed |
| CMP_TAB | Tab | Scene 02、Gallery | Idle、Down、Selected、Disabled |
| CMP_ICON | Icon | 全部场景、Gallery | Idle、Enhanced、Disabled、Completed |
| CMP_PROGRESS | Progress Bar | Scene 04 | Result Stable、Unknown Segment、Completed Segment |
| CMP_LIST_ITEM | Report List Item | Scene 04 | Idle、Selected、Completed、Unknown |

## 4.2 组件状态覆盖矩阵

| State | Button | Panel | Photo | Node | Tab | Icon |
|---|---|---|---|---|---|---|
| Idle | 必须 | Stable对应 | 必须 | 必须 | 必须 | 必须 |
| Touch Down | 必须 | 不适用或锁定 | 必须 | 必须 | 必须 | 必须 |
| Touch Hold | 允许组件必须 | 不适用 | 任务需要时 | 任务需要时 | 不使用 | 不使用 |
| Touch Release | 必须 | Open/Close完成 | 必须 | 必须 | 必须 | 必须 |
| Selected | 必须展示 | 当前Panel | 必须 | 必须 | 必须 | 视语义 |
| Disabled | 必须 | 交互锁定 | 必须 | 必须 | 必须 | 必须 |
| Completed | 入口锁定样本 | 归档Panel | Recovered | Recovered | 视语义 | 完成标记 |

## 4.3 命名要求

所有Showcase元素必须具备：

| 字段 | 规则 |
|---|---|
| Element ID | 全局唯一、稳定、不随显示文本变化 |
| Component ID | 指向唯一组件母版 |
| Page ID | 指向所在Showcase页面 |
| State | 使用Interaction Bible标准名称 |
| Business State | 使用Unknown、Partial、Recovered、Completed等业务状态 |
| Motion ID | 指向Motion Bible标准Motion Record |
| Hitbox Token | 引用Visual Bible v1.1，不在Showcase重定义 |

---

# 5 验收标准

## 5.1 阶段门禁

只有Showcase通过后，才允许进入正式游戏UI开发。

| Gate | 必须通过的内容 | 失败结果 |
|---|---|---|
| G1 Visual Fidelity | 材质、色彩、字体、尺寸、Safe Area与组件一致 | 返回UI设计调整 |
| G2 Touch Reliability | Hitbox、取消、误触、滚动与连续点击保护完整 | 返回交互调整 |
| G3 Memory Motion | 开始回忆、照片修复、节点恢复与转场符合主题 | 返回Motion调整 |
| G4 Mobile Comfort | 横屏拇指操作、阅读、遮挡与系统Inset合格 | 返回布局执行调整 |
| G5 Component Completeness | 组件状态覆盖完整且可复用 | 禁止进入正式页面开发 |
| G6 Debug Traceability | Element、State、Motion、Hitbox与Target可追踪 | 补齐调试与数据契约 |
| G7 QA Closure | 阻断级与高级缺陷关闭 | 不签署通过 |

## 5.2 强制验收项

| 验收项 | 通过标准 |
|---|---|
| 按钮不是网页按钮效果 | 无纯色矩形、现代卡片、浏览器原生反馈 |
| Touch反馈符合记忆主题 | Touch Down像压住纸张，Release像确认旧物回应 |
| 开始回忆具有特殊唤醒效果 | Dormant、Awakening、Confirmed、Handoff完整且区别于普通按钮 |
| 页面展开符合旧档案逻辑 | 有来源、方向、装订边或档案层级，不只使用Fade |
| 照片恢复具有记忆修复感觉 | 包含碎片落定、边缘修复、影像与色彩恢复、归档确认 |
| 所有组件状态完整 | Gallery与真实Scene均覆盖必要状态 |
| 手机横屏操作舒适 | 触控准确、信息清楚、手指不遮挡、Safe Area合格 |
| 没有现代APP视觉 | 无Glass、Bootstrap、扁平白卡、商城或科技HUD |

## 5.3 状态验收

| 检查项 | 通过条件 |
|---|---|
| Idle | 稳定，不依赖循环动效提示可点击 |
| Touch Down | 即时确认接触对象 |
| Touch Hold | 只在允许组件生效，不无限增强 |
| Invalid Release | 不触发Action，不写数据 |
| Selected | 与业务状态可叠加 |
| Disabled | 不进入Pressed，不播放可点击反馈 |
| Completed | 稳定持久，不重复播放完成 |
| Action Lock | 连续点击只触发一次 |
| Transition Lock | 转场期间拒绝新Action |

## 5.4 Motion验收

| Motion | 通过标准 |
|---|---|
| Button Press | 纸张、阴影、边缘和图标属于同一物件 |
| Memory Reveal | 局部显影，不是全屏商业奖励 |
| Panel Open | 有旧相册/档案盒来源 |
| Photo Restore | 修复后进入稳定状态 |
| Node Recover | Unknown→Partial→Recovered层级清晰 |
| Page Transition | 来源页与目标页有叙事关系 |
| Waiting | 无普通Loading圆圈 |
| Reduced Motion | 状态与操作仍完整可理解 |

## 5.5 评审签署

| 角色 | 签署内容 |
|---|---|
| UI设计负责人 | Visual Bible一致性 |
| UX / Interaction负责人 | 状态、触摸、手势与流程 |
| Motion负责人 | Memory Motion Language与反馈层级 |
| 程序负责人 | Element Record、状态机与测试入口可实现 |
| QA负责人 | 测试覆盖、缺陷关闭与设备验证 |
| 项目负责人 | 正式UI开发Gate通过 |

---

# 6 程序实现需求

本章只定义Demo的功能需求和验证能力，不指定代码、框架或技术方案。

## 6.1 基础运行要求

| Requirement ID | 要求 |
|---|---|
| DEMO-R01 | 固定使用1280×720 LP逻辑画布 |
| DEMO-R02 | 仅以Mobile Landscape为主要测试方向 |
| DEMO-R03 | 兼容Visual Bible v1.1定义的三档输出 |
| DEMO-R04 | 遵守Core Safe Area、Interactive Safe Area与系统Inset |
| DEMO-R05 | 所有交互对象使用Bible Hitbox，不以视觉边界代替 |
| DEMO-R06 | Showcase测试数据与正式游戏数据完全隔离 |
| DEMO-R07 | 任意测试场景可以独立进入与重置 |
| DEMO-R08 | 不需要完成正式剧情、章节或玩法系统 |

## 6.2 状态控制要求

| Requirement ID | 要求 |
|---|---|
| STATE-R01 | 每个可交互元素可查询当前Interaction State |
| STATE-R02 | 支持Idle、Touch Down、Touch Hold、Touch Release、Selected、Disabled、Completed |
| STATE-R03 | 支持业务状态与交互状态叠加 |
| STATE-R04 | 支持有效Release、无效Release、Cancel和System Interrupt |
| STATE-R05 | 支持Action Lock与Transition Lock |
| STATE-R06 | 支持从Debug控制台强制进入测试状态，但不得修改组件定义 |
| STATE-R07 | Reset后恢复场景固定初始状态 |

## 6.3 Motion控制要求

| Requirement ID | 要求 |
|---|---|
| MOTION-R01 | 每个关键Motion可独立触发 |
| MOTION-R02 | 可重置到Source State |
| MOTION-R03 | 可触发Cancel、Failure和System Interrupt路径 |
| MOTION-R04 | 可查看Motion ID、Level、Priority、Source State和Target State |
| MOTION-R05 | 支持Reduced Motion测试 |
| MOTION-R06 | Motion结束后状态必须与Interaction Bible一致 |
| MOTION-R07 | Motion不得改变Hitbox与Safe Area |

## 6.4 触控记录要求

| Requirement ID | 要求 |
|---|---|
| TOUCH-R01 | 显示触点位置与所属Touch Target |
| TOUCH-R02 | 区分Visual Bounds与Hitbox |
| TOUCH-R03 | 记录Down、Move、Hold、Release、Cancel |
| TOUCH-R04 | 记录Tap候选何时转为Drag或Swipe |
| TOUCH-R05 | 记录无效点击原因 |
| TOUCH-R06 | 记录多指误触与触摸所有权 |
| TOUCH-R07 | 调试记录不进入正式游戏数据 |

## 6.5 页面与浏览态要求

| Requirement ID | 要求 |
|---|---|
| PAGE-R01 | 页面进入和返回符合Interaction Bible |
| PAGE-R02 | 详情抽屉、照片Focus等局部上下文优先关闭 |
| PAGE-R03 | 返回后恢复规定的分类、节点、视口和滚动位置 |
| PAGE-R04 | 目标进入失败可恢复来源页 |
| PAGE-R05 | Scene Handoff只进入Showcase占位目标 |
| PAGE-R06 | Debug Mode关闭后不残留调试元素 |

## 6.6 性能体验要求

| 检查项 | 要求 |
|---|---|
| 跟手性 | Touch Down、Drag与Swipe必须直接响应触点 |
| 状态一致性 | 快速操作或中断后不出现悬空Pressed、错误Selected或重复Completed |
| 资源稳定 | 重复播放关键Motion不改变清晰度、位置或材质基线 |
| 页面稳定 | 多次进入退出后布局、Hitbox和浏览态一致 |
| 长时间测试 | Ambient与Waiting不造成反馈越来越强或状态漂移 |

---

# 7 Asset需求

## 7.1 Asset原则

Showcase只使用Visual Bible已定义的视觉体系。Asset需求用于验证组件和Motion，不代表建立新的正式游戏资源风格。

## 7.2 基础材质

| Asset组 | 数量要求 | 用途 |
|---|---|---|
| P0阅读纸 | 至少1套 | 报告、设置、正文Panel |
| P1档案纸 | 至少1套 | Button、Panel、Tab |
| P2记忆纸 | 至少1套 | Photo Card、Memory Node |
| P3未知纸 | 至少1套 | Unknown与Disabled |
| 纸张边缘Alpha | 各等级配套 | 验证破损、阴影与裁切 |
| 纸张纹理 | 1×与2×适配源 | 验证三档输出纹理频率 |

## 7.3 组件Asset

| Asset组 | 必需变体 |
|---|---|
| Primary Button | Idle、Pressed、Disabled、Selected及可分层纸张/边缘/图标 |
| Memory Awakening Button | Dormant、Awakening、Confirmed所需分层 |
| Secondary / Bottom / Icon Button | Idle、Pressed、Disabled、Selected |
| Panel | Primary Sheet、Archive Card、Pinned Note、Modal Folder |
| Photo Frame | Normal、Broken、Partial、Recovered、Selected |
| Memory Node | Unknown、Partial、Recovered、Selected、Completed |
| Tab | Idle、Pressed、Selected、Disabled |
| Icon | Navigation、Object、State、Input四类测试样本 |
| Progress | 槽、恢复段、未知段、软下限标记 |

## 7.4 Motion分层Asset

| Motion | Asset分层需求 |
|---|---|
| Button Press | 纸芯、背纸、阴影、边缘、图标、文字分离 |
| Memory Reveal | 旧纸、暖光遮罩、褪色影像、清晰影像、边缘层 |
| Panel Open | Panel主体、底层档案、阴影、装订或来源边 |
| Photo Restore | 碎片、裂缝遮罩、完整照片、色彩恢复遮罩、归档标记 |
| Node Recover | Unknown影像、Partial影像、Recovered影像、连接线与图钉 |
| Page Transition | 来源对象、目标Panel或场景占位、背景环境层 |
| Waiting | 档案标签、纸页、照片显影或章节题签 |

## 7.5 测试内容Asset

| Asset | 要求 |
|---|---|
| 人物照片 | 同一人物提供Unknown、Partial、Recovered测试版本 |
| 地点照片 | 至少1组，避免Gallery只验证人物 |
| 破损照片 | 1张完整源 + 6个测试碎片 + 裂缝遮罩 |
| 章节报告缩略图 | 至少6张恢复记忆样本 |
| 未知记忆占位 | 至少4个不同缺损轮廓 |
| 图标组 | 返回、关闭、设置、档案、章节、状态与完成 |

## 7.6 声音占位

Showcase允许使用临时但风格正确的声音占位。

| Feedback Slot | 用途 |
|---|---|
| AUDIO_PAPER_TOUCH | Button与纸张Tap |
| AUDIO_PAPER_RELEASE | 有效Release |
| AUDIO_MEMORY_AWAKEN | 记忆唤醒 |
| AUDIO_MEMORY_CONFIRM | Memory Confirmed |
| AUDIO_PANEL_OPEN | 档案展开 |
| AUDIO_PANEL_CLOSE | 档案收回 |
| AUDIO_PHOTO_DRAG | 照片/碎片移动 |
| AUDIO_DROP_VALID | 合法Drop |
| AUDIO_DROP_INVALID | 错误Drop |
| AUDIO_ARCHIVE_STAMP | Completed / Recovered |
| AUDIO_WAITING | 世界观等待 |

声音占位不得使用现代系统提示音、街机奖励音或科技扫描音。

## 7.7 触感占位

| Haptic Slot | 用途 |
|---|---|
| HAPTIC_TOUCH_LIGHT | 普通Touch Down |
| HAPTIC_RELEASE_CONFIRM | 有效Release |
| HAPTIC_MEMORY_CONFIRM | 记忆唤醒确认 |
| HAPTIC_DROP_VALID | 合法Drop |
| HAPTIC_DROP_INVALID | 错误Drop的克制提示 |
| HAPTIC_COMPLETED | Recovered / Completed |
| HAPTIC_BOUNDARY | 列表或关系图边界 |

触感必须可关闭，且不得承担唯一信息。

---

# 8 QA Checklist

## 8.1 基础平台

- [ ] 逻辑画布固定为1280×720 LP。
- [ ] 所有测试以手机横屏为唯一标准。
- [ ] 16:9画布没有被拉伸。
- [ ] 超宽设备只扩展环境背景，不改变主UI布局。
- [ ] Core Safe Area内包含全部关键信息。
- [ ] Interactive Safe Area内包含全部主要触控对象。
- [ ] 刘海、挖孔、圆角与系统手势区没有遮挡主要UI。

## 8.2 Visual Bible继承

- [ ] 色彩与v1.1一致。
- [ ] 纸张、照片、胶带、回形针、印章与阴影一致。
- [ ] 字体、字号与移动端层级一致。
- [ ] Button视觉尺寸一致。
- [ ] 组件Hitbox没有缩小。
- [ ] 没有新增现代App卡片。
- [ ] 没有科技HUD、霓虹蓝或商城视觉。
- [ ] 装饰没有遮挡文本或触控区。

## 8.3 Interaction Bible继承

- [ ] Idle状态正确。
- [ ] Touch Down即时反馈。
- [ ] Touch Hold只用于允许对象。
- [ ] Touch Release Valid只触发一次Action。
- [ ] Touch Release Invalid不触发Action。
- [ ] Selected与业务状态可叠加。
- [ ] Disabled不响应按下。
- [ ] Completed稳定持久。
- [ ] Action Lock阻止连续点击。
- [ ] Transition Lock阻止转场重复触发。
- [ ] 系统中断后回到最近稳定状态。

## 8.4 Motion Bible继承

- [ ] Button Press像纸张压入，而不是网页换色。
- [ ] Memory Reveal从局部显影开始。
- [ ] Panel Open有档案来源和方向。
- [ ] Photo Restore包含完整修复语义。
- [ ] Node Recover三阶段清晰。
- [ ] Page Transition不是单纯Fade。
- [ ] Waiting没有普通Loading圆圈。
- [ ] 同屏只有一个主要Narrative Motion。
- [ ] Reduced Motion保留所有必要状态反馈。

## 8.5 Scene 01

- [ ] 游戏标题与六个入口完整。
- [ ] 无存档时“开始回忆”为Primary。
- [ ] 有存档时“继续昨日”为Primary。
- [ ] 六种Button状态均可测试。
- [ ] 开始回忆完成Dormant→Awakening→Confirmed→Handoff。
- [ ] 无效Release可以撤销唤醒。
- [ ] 连续点击不会重复Handoff。
- [ ] Showcase Handoff不进入正式游戏。

## 8.6 Scene 02

- [ ] 左分类、中央关系图、右详情抽屉完整。
- [ ] Unknown、Partial、Recovered同时可见或可切换。
- [ ] Node Selected正确展开详情。
- [ ] 选择新Node时旧Node恢复业务状态。
- [ ] 空白区Tap关闭详情。
- [ ] 抽屉关闭Icon只关闭局部上下文。
- [ ] 空白Drag平移关系图。
- [ ] Node Drag不会误移动节点。
- [ ] 分类切换清除Selected并更新内容。
- [ ] 抽屉Swipe不带动关系图。

## 8.7 Scene 03

- [ ] 破损照片、碎片与Recovered照片完整。
- [ ] Drag跟手。
- [ ] 合法Drop具有吻合反馈。
- [ ] 错误Drop回到最近稳定位置。
- [ ] 错误Drop不扣永久进度。
- [ ] 最后一块只触发一次Restore。
- [ ] 边缘、影像、色彩和归档均完成。
- [ ] Recovered后不重复恢复。

## 8.8 Scene 04

- [ ] 结果、恢复列表、未知记忆与继续按钮首屏可见。
- [ ] 阅读顺序清晰。
- [ ] 恢复列表可独立滚动。
- [ ] 未知列表可独立滚动。
- [ ] 列表不会误触底部按钮。
- [ ] 查看档案后可恢复报告浏览态。
- [ ] 继续昨日不重复写入结果。
- [ ] Handoff失败可回到Stable报告页。

## 8.9 Component Gallery

- [ ] Button状态齐全。
- [ ] Panel状态齐全。
- [ ] Photo Card状态齐全。
- [ ] Memory Node状态齐全。
- [ ] Tab状态齐全。
- [ ] Icon状态齐全。
- [ ] Completed与Selected不会混淆。
- [ ] 组件在Gallery与真实Scene中的表现一致。

## 8.10 Debug Mode

- [ ] Element ID正确。
- [ ] State正确。
- [ ] Motion ID正确。
- [ ] Touch Target正确。
- [ ] Hitbox可见且符合Bible。
- [ ] Visual Bounds与Hitbox可区分。
- [ ] 相邻Hitbox不重叠。
- [ ] 装饰元素不响应触摸。
- [ ] 状态日志能追踪完整触摸序列。
- [ ] 关闭Debug后没有残留。
- [ ] Debug不能进入正式游戏。

## 8.11 Motion Lab

- [ ] Button Press可独立触发。
- [ ] Memory Reveal可独立触发。
- [ ] Panel Open与Close可独立触发。
- [ ] Photo Restore可独立触发。
- [ ] Node Recover可独立触发。
- [ ] Page Transition可独立触发。
- [ ] Waiting成功、失败与取消可测试。
- [ ] Cancel与System Interrupt路径可测试。
- [ ] Reduced Motion可比较。
- [ ] Audio与Haptic关闭后仍可理解。

## 8.12 最终Gate

- [ ] 按钮不是网页按钮效果。
- [ ] Touch反馈符合记忆主题。
- [ ] 开始回忆具有特殊唤醒效果。
- [ ] 页面展开符合旧档案逻辑。
- [ ] 照片恢复具有记忆修复感觉。
- [ ] 所有组件状态完整。
- [ ] 手机横屏操作舒适。
- [ ] 没有现代APP视觉。
- [ ] 没有阻断级缺陷。
- [ ] UI、Interaction、Motion、程序与QA负责人均已签署。

---

# 9 Demo交付清单

## 9.1 必交内容

| Deliverable | 内容 |
|---|---|
| Showcase Demo | 可独立打开和触摸的UI验证实验室 |
| Scene 01–04 | 四个完整测试场景 |
| Component Gallery | 组件与状态集中展示 |
| Interaction Debug Mode | ID、State、Motion、Touch Target与Hitbox |
| Motion Validation Lab | 关键Motion独立触发与重置 |
| QA Summary | 测试结果、缺陷、负责人和Gate状态 |
| Asset Manifest | Showcase实际使用的全部视觉、声音与触感占位 |
| Test Data Manifest | 测试存档、节点、照片碎片与报告数据说明 |

## 9.2 缺陷等级

| Level | 定义 | Gate处理 |
|---|---|---|
| Blocker | 无法进入场景、状态错误、数据污染、正式游戏误启动 | 必须关闭 |
| High | Hitbox错误、重复触发、Motion语义错误、主要页面不可读 | 必须关闭 |
| Medium | 局部反馈不一致、次级内容布局或声音占位问题 | 评估后关闭或记录 |
| Low | 不影响规范判断的轻微表现偏差 | 可进入后续但必须记录 |

## 9.3 退出条件

Showcase通过后，团队获得：

1. 一个经触摸验证的移动横屏UI母版。
2. 一套经场景验证的组件状态系统。
3. 一套可复用的Memory Motion Language样本。
4. 一套正式页面开发可直接引用的Element、State与Motion命名。
5. 一份签署完成的QA结果。

Showcase未通过时，不允许以“正式开发时再调整”为理由跳过Gate。

---

# 10 最终验收声明

《昨日重现》的UI Showcase不是一组静态效果截图，也不是组件展示网页。

它必须让团队成员在手机横屏中亲自确认：

- 手指压住的是一张旧纸。
- 被拿起的是一张保存多年的照片。
- 被选中的是一段尚未完整的关系。
- 被修复的是一段真实的人生记忆。
- 被确认的不只是按钮操作，而是一段重新归档的过去。

只有当这些感受在四个测试场景、Component Gallery、Debug Mode与Motion Lab中保持一致，《昨日重现》的正式游戏UI开发才可以开始。

---

**END OF UI SHOWCASE DEMO SPECIFICATION v1.0**
