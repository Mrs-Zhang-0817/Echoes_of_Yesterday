
# 《昨日重现》
# Typography Bible v1.0
## 字体视觉规范文档

版本：v1.0  
项目：《昨日重现（Yesterday Once More）》  
适用范围：
- 主界面 UI
- 记忆档案 UI
- 章节恢复报告
- 游戏内 HUD
- 剧情文本
- 手写记忆文本
- 记忆异常效果

---

# 1. 字体设计核心理念

## 一句话定义

> 《昨日重现》的字体不是信息展示工具，而是老人正在恢复的人生记录。

字体需要体现：

- 90年代中国家庭生活
- 老照片背后的文字
- 泛黄纸张上的记录
- 时间留下的痕迹
- 逐渐恢复与逐渐消失的记忆

---

# 2. Typography System 总览

项目采用五级字体体系：

```

Typography System

├── A. Title Font
│   主标题字体
│
├── B. Chapter Font
│   章节标题字体
│
├── C. Body Font
│   正文字体
│
├── D. Handwriting Font
│   手写记忆字体
│
└── E. System Font
系统辅助字体

```

---

# 3. A类字体：Title Font
## 主标题字体

## 使用范围

用于：

- 游戏标题
- 大型 UI 标题
- 章节核心标题
- 重要记忆节点

示例：

```

昨日重现

记忆恢复报告

```

---

## 视觉定位

关键词：

```

东方书写感
旧书封面
墨迹
文学感
时间沉淀

```

---

## 字体特征

必须具备：

- 类毛笔笔触
- 横竖笔画明显
- 自然顿挫
- 轻微墨迹扩散
- 不完全机械规整

避免：

- 现代商业字体
- 科技字体
- 游戏标题字体

---

## 字重

推荐：

```

700-900
Heavy / Bold

```

---

## 字距

要求：

略微收紧。

```

Letter spacing:
-5% ~ 0%

```

避免：

现代海报字体过度留白。

---

## 颜色规范

默认：

```

深棕墨色

HEX:
#4A2E1B

```

特殊恢复状态：

```

暖棕

HEX:
#6B4022

```

---

## AI描述关键词

```

traditional Chinese brush-inspired display font,
aged ink texture,
literary old book cover feeling,
warm brown ink color,
slightly irregular brush strokes,
nostalgic Chinese family memory style

```

---

# 4. B类字体：Chapter Font
## 章节标题字体

---

## 使用范围

用于：

- 第二章·接女儿放学
- 第三章·迷途
- 第九章·旧时光的风铃

---

## 视觉定位

> 家庭档案标题文字

比主标题更稳定、更容易阅读。

---

## 字体特征

要求：

- 手写楷体感
- 老式记录感
- 温暖
- 清晰

---

## 字重

```

500-600
Medium

```

---

## 颜色

```

HEX:
#5A3822

```

---

# 5. C类字体：Body Font
## 正文字体

---

## 使用范围

用于：

- UI说明文字
- 章节描述
- 记忆恢复内容
- 档案信息

示例：

```

你成功完成了本章的故事，
部分记忆变得更加清晰。

```

---

## 视觉定位

> 老家庭记录、旧书印刷文字。

---

## 特征

要求：

- 高可读性
- 温暖
- 稳定
- 不现代

---

## 字重

```

400
Regular

```

---

## 行距

推荐：

```

160%-180%

```

原因：

叙事游戏需要呼吸感。

---

## 颜色

```

HEX:
#6B5744

```

---

# 6. D类字体：Handwriting Font
## 手写记忆字体

---

## 重要等级

★★★★★

这是《昨日重现》的核心字体。

---

## 使用范围

用于：

- 女儿留言
- 便利贴
- 日记
- 家庭记录
- 内心独白

示例：

```

爸：

记得吃药。

我晚上回来。

```

---

## 视觉定位

> 真实存在过的人写下的文字。

---

## 特征

必须：

- 笔画粗细变化
- 不完全工整
- 有停顿感
- 像真实钢笔书写

---

## 禁止

禁止：

- 可爱手账字体
- 儿童字体
- 卡通字体

---

## 颜色

铅笔：

```

#686056

```

钢笔：

```

#3D3328

```

---

## 特殊效果

允许：

- 墨迹扩散
- 字迹缺失
- 透明度变化
- 模糊恢复

用于表现：

记忆消退。

---

# 7. E类字体：System Font
## 系统辅助字体

---

## 使用范围

用于：

- 英文副标题
- 日期
- 编号
- 百分比
- 小标签

示例：

```

MEMORY RESTORATION REPORT

CHAPTER 02

```

---

## 视觉定位

现代整理感。

作用：

平衡复古中文字体。

---

## 特征

要求：

- 无衬线
- 简洁
- 小型大写
- 字间距增加

---

# 8. 中英文混排规范

## 原则

中文负责情绪。

英文负责信息辅助。


正确：

```

记忆恢复报告

MEMORY RESTORATION REPORT

```

比例：

中文：

100%

英文：

25%-35%

---

# 9. UI按钮字体规范

使用位置：

- 开始回忆
- 继续昨日
- 查看记忆档案
- 返回主页

---

## 特征

要求：

- 中等粗细
- 温暖
- 有纸张印刷感

---

## 字号

```

24-32px

```

---

## 默认颜色

```

#5A3A20

```

---

## Hover状态

```

#8B572A

```

---

# 10. 动态字体效果规范

## 10.1 普通出现

禁止瞬间出现。

动画：

```

透明度 0%

↓

墨迹浮现

↓

100%

```

时间：

```

0.5-1s

```

---

# 10.2 记忆恢复效果

文字状态：

```

模糊

↓

笔迹聚合

↓

清晰

```

例如：

```

YY

↓

丫丫

```

---

# 10.3 记忆错误效果

用于阿尔茨海默状态。

效果：

- 缺字
- 错位
- 模糊
- 消散


示例：

正常：

```

女儿

```

异常：

```

女 ？

```

---

# 11. 字体资产结构建议

```

assets/

fonts/

├── title/
│   └── memory_title.ttf
│
├── chapter/
│   └── archive_title.ttf
│
├── body/
│   └── warm_text.ttf
│
├── handwriting/
│   └── daughter_note.ttf
│
└── system/
└── ui_system.ttf

```

---

# 12. 给 Codex 的统一字体指令

以后所有 UI 开发必须加入：

```

严格遵守《昨日重现 Typography Bible v1.0》。

Typography requirements:

The game uses a cinematic nostalgic Chinese memory archive typography system.

Title:
Chinese brush-inspired display font,
aged ink texture,
literary old book cover feeling.

Chapter titles:
handwritten archive style,
warm traditional Chinese print feeling.

Body text:
high readability,
old family document style,
warm brown ink color.

Handwriting:
real human handwritten notes,
uneven strokes,
pen texture,
personal memory feeling.

System text:
minimal sans-serif,
small uppercase English labels,
used only for secondary information.

Avoid:
modern UI fonts,
futuristic fonts,
game HUD fonts,
cute handwriting fonts.

```

---

# 13. 最终字体设计原则

所有字体必须回答：

> 如果这句话存在于老人记忆里，它应该是什么形式留下来的？

如果答案不是：

- 老照片背面的字
- 家庭相册里的标题
- 手写留言
- 旧日记录

则不符合《昨日重现》的字体体系。

---

