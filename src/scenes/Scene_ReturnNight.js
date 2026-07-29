import { drawPrompt, roundedRect } from './sceneUtils.js';
import { SOUND_SOURCES, GATING1_CONFIG, ELEVATOR_CONFIG, ELEVATOR_BUTTONS, getSourceLoudness, getButtonRect } from './returnNightLayout.js';

export class SceneReturnNight {
  constructor(game) {
    this.game = game;
    this.phase = 'narrative';     // narrative | gating1 | gating1_celebrate | gating2 | gating2_elevating | complete
    this.phaseTime = 0;
    this.completionLogged = false;
    this.time = 0;

    // Gating 1 — 声相定位
    this.scanPos = 640;           // 当前扫描位置 (0~1280)
    this.dragging = false;
    this.dragStartX = 0;
    this.scanStartX = 640;
    this.sourcesFound = 0;
    this.isLocking = false;       // 是否在对准状态下按住
    this.lockTargetIdx = -1;      // 正在锁定的声源索引
    // 深拷贝声源状态
    this.sources = SOUND_SOURCES.map(s => ({ ...s, found: false, lockProgress: 0, wavePhase: s.wavePhase }));

    // Gating 2 — 电梯按钮
    this.hoveredBtn = -1;
    this.errorTimer = 0;          // 错误闪烁计时
    this.errorBtnIdx = -1;
    this.elevateOffset = 0;       // 电梯上升动画偏移
    this.successFlash = 0;        // 正确按钮发光
    this.lastPressed = -1;        // 最后按下的按钮索引

    // 叙事文本
    this.narrativeLines = [
      '走出警局，坐上了女儿的车。',
      '窗外的霓虹灯流光溢彩……',
      '车子驶入了住了几十年的老小区。',
      '可是在夜色中，这里却像一个巨大的迷宫。',
    ];
  }

  onEnter() {
    this.game.input.setHandlers({
      down: point => this.handleDown(point),
      move: point => this.handleMove(point),
      up: point => this.handleUp(point),
      cancel: () => this.handleCancel(),
    });
  }

  onExit() {
    this.game.input.setHandlers();
  }

  // ============ 输入处理 ============

  handleDown(point) {
    if (this.phase === 'narrative') {
      if (this.phaseTime > 1.5) {
        this.phase = 'gating1';
        this.phaseTime = 0;
      }
    } else if (this.phase === 'gating1') {
      this.dragging = true;
      this.dragStartX = point.x;
      this.scanStartX = this.scanPos;

      // 检查是否对准了某个声源
      const idx = this.getNearestSourceIndex();
      if (idx >= 0 && !this.sources[idx].found) {
        const loud = getSourceLoudness(this.scanPos, this.sources[idx].screenBaseX);
        if (loud > 0.3) {
          this.isLocking = true;
          this.lockTargetIdx = idx;
        }
      }
    } else if (this.phase === 'gating2') {
      // 检测是否点击了某个按钮
      for (let i = 0; i < ELEVATOR_BUTTONS.length; i++) {
        const rect = getButtonRect(i);
        if (point.x >= rect.x && point.x <= rect.x + rect.w &&
            point.y >= rect.y && point.y <= rect.y + rect.h) {
          this.handleButtonPress(i);
          return;
        }
      }
    }
  }

  handleMove(point) {
    if (this.phase === 'gating1' && this.dragging) {
      const dx = point.x - this.dragStartX;
      if (Math.abs(dx) > GATING1_CONFIG.dragDeadZone) {
        this.scanPos = Math.max(0, Math.min(1280, this.scanStartX + dx));

        // 如果正在锁定，检查是否移出了范围
        if (this.isLocking && this.lockTargetIdx >= 0) {
          const source = this.sources[this.lockTargetIdx];
          const loud = getSourceLoudness(this.scanPos, source.screenBaseX);
          if (loud <= 0.1) {
            this.isLocking = false;
            this.lockTargetIdx = -1;
          }
        }
      }

      // 重新检查是否对准新声源
      if (!this.isLocking) {
        const idx = this.getNearestSourceIndex();
        if (idx >= 0 && !this.sources[idx].found) {
          const loud = getSourceLoudness(this.scanPos, this.sources[idx].screenBaseX);
          if (loud > 0.3) {
            this.isLocking = true;
            this.lockTargetIdx = idx;
          }
        }
      }
    }
  }

  handleUp(_point) {
    if (this.phase === 'gating1') {
      this.dragging = false;
      // 如果没有锁定成功，重置进度
      if (this.isLocking && this.lockTargetIdx >= 0) {
        const source = this.sources[this.lockTargetIdx];
        if (source.lockProgress < 1) {
          source.lockProgress = 0;
        }
      }
      this.isLocking = false;
      this.lockTargetIdx = -1;
    }
  }

  handleCancel() {
    this.dragging = false;
    if (this.isLocking && this.lockTargetIdx >= 0) {
      this.sources[this.lockTargetIdx].lockProgress = 0;
    }
    this.isLocking = false;
    this.lockTargetIdx = -1;
  }

  // ============ 辅助方法 ============

  getNearestSourceIndex() {
    let minDist = Infinity;
    let idx = -1;
    for (let i = 0; i < this.sources.length; i++) {
      if (this.sources[i].found) continue;
      const dist = Math.abs(this.scanPos - this.sources[i].screenBaseX);
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    }
    return idx;
  }

  handleButtonPress(idx) {
    if (this.phase !== 'gating2') return;
    this.lastPressed = idx;

    if (idx === ELEVATOR_CONFIG.correctIndex) {
      // 正确！
      this.phase = 'gating2_elevating';
      this.phaseTime = 0;
      this.successFlash = 1;
      this.elevateOffset = 0;
      navigator.vibrate?.(15);
    } else {
      // 错误
      this.errorTimer = 0.4;
      this.errorBtnIdx = idx;
      navigator.vibrate?.(30);
    }
  }

  // ============ update 循环 ============

  update(dt) {
    this.time += dt;
    this.phaseTime += dt;

    switch (this.phase) {
      case 'narrative':
        if (this.phaseTime >= 6) {
          this.phase = 'gating1';
          this.phaseTime = 0;
        }
        break;

      case 'gating1':
        this.updateGating1(dt);
        break;

      case 'gating1_celebrate':
        if (this.phaseTime >= 2) {
          this.phase = 'gating2';
          this.phaseTime = 0;
          this.scanPos = 640;
        }
        break;

      case 'gating2':
        // 更新悬停
        this.hoveredBtn = -1;
        this.updateGating2InputCheck();

        // 错误闪烁计时
        if (this.errorTimer > 0) {
          this.errorTimer = Math.max(0, this.errorTimer - dt);
        }
        break;

      case 'gating2_elevating':
        this.successFlash = Math.max(0, this.successFlash - dt * 1.5);
        this.elevateOffset += dt * 180;
        if (this.phaseTime >= 2.5 && !this.completionLogged) {
          this.completionLogged = true;
          this.phase = 'complete';
          this.phaseTime = 0;
          this.game.onReturnNightComplete?.();
        }
        break;

      case 'complete':
        if (this.phaseTime >= 2) {
          // 切换到后续章节（预留）
        }
        break;
    }
  }

  updateGating1(dt) {
    // 声源波形动画
    for (const source of this.sources) {
      source.wavePhase += dt * 2.5;
    }

    // 锁定进度
    if (this.isLocking && this.lockTargetIdx >= 0) {
      const source = this.sources[this.lockTargetIdx];
      source.lockProgress += dt / GATING1_CONFIG.dwellTime;
      if (source.lockProgress >= 1) {
        source.lockProgress = 1;
        source.found = true;
        this.sourcesFound++;
        this.isLocking = false;
        this.lockTargetIdx = -1;
        navigator.vibrate?.(20);

        if (this.sourcesFound >= 3) {
          this.phase = 'gating1_celebrate';
          this.phaseTime = 0;
        }
      }
    }
  }

  updateGating2InputCheck() {
    // 如果鼠标/手指在画布上但没有按下，不处理悬停
    // 悬停逻辑只在桌面端有用，移动端不依赖
  }

  // ============ 渲染 ============

  render(ctx) {
    const { width, height } = this.game;

    switch (this.phase) {
      case 'narrative':
        this.renderNarrative(ctx);
        break;
      case 'gating1':
      case 'gating1_celebrate':
        this.renderGating1(ctx);
        break;
      case 'gating2':
        this.renderGating2(ctx);
        break;
      case 'gating2_elevating':
        this.renderGating2Elevating(ctx);
        break;
      case 'complete':
        this.renderComplete(ctx);
        break;
      default:
        ctx.fillStyle = '#0a0806';
        ctx.fillRect(0, 0, width, height);
    }
  }

  // ---------- 叙事开场 ----------

  renderNarrative(ctx) {
    const { width, height } = this.game;
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, width, height);

    // 渐入效果
    const alpha = Math.min(1, this.phaseTime / 1.5);
    const textIdx = Math.min(Math.floor(this.phaseTime / 1.2), this.narrativeLines.length - 1);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#d4b896';
    ctx.font = '500 28px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 显示当前叙事文本
    const currentText = this.narrativeLines[textIdx];
    // 打字机效果
    const chars = Math.floor((this.phaseTime - textIdx * 1.2) / 0.03);
    const displayText = currentText.slice(0, Math.min(chars, currentText.length));

    ctx.fillText(displayText, width / 2, height / 2 - 20);

    // 底部提示
    if (this.phaseTime > 3.5) {
      ctx.globalAlpha = Math.min(1, (this.phaseTime - 3.5) / 0.8);
      ctx.fillStyle = '#8a7a6a';
      ctx.font = '16px system-ui, "PingFang SC", sans-serif';
      ctx.fillText('点击或触摸继续……', width / 2, height - 60);
    }

    ctx.restore();
  }

  // ---------- Gating 1：声相定位 ----------

  renderGating1(ctx) {
    const { width, height } = this.game;

    // 1. 深色夜空背景
    this.drawNightSky(ctx, width, height);

    // 2. 远景建筑剪影
    this.drawBuildingSilhouettes(ctx, width, height);

    // 3. 声源波纹绘制
    this.drawSoundWaves(ctx);

    // 4. 半透明噪点层（视觉模糊模拟）
    this.drawNoiseOverlay(ctx, width, height);

    // 5. 扫描线
    this.drawScanLine(ctx, width, height);

    // 6. 方位指示器（顶部）
    this.drawCompass(ctx, width);

    // 7. 锁定进度环
    this.drawLockProgress(ctx);

    // 8. 庆祝效果
    if (this.phase === 'gating1_celebrate') {
      this.drawCelebration(ctx, width, height);
    }

    // 9. 底部提示
    const foundText = `已找到 ${this.sourcesFound} / 3 个声音来源`;
    ctx.fillStyle = '#a09080';
    ctx.font = '16px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(foundText, width / 2, height - 48);

    if (this.sourcesFound < 3) {
      drawPrompt(ctx, '← 左右拖动，寻找熟悉的声音 →', width / 2, height - 18, 0);
    }
  }

  drawNightSky(ctx, width, height) {
    // 渐变夜空
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0a0a14');
    grad.addColorStop(0.4, '#12101e');
    grad.addColorStop(0.7, '#1a1424');
    grad.addColorStop(1, '#0d0805');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 星星
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5 + i * i * 0.3) % width;
      const sy = (i * 89.3 + i * i * 0.7) % (height * 0.4);
      const size = 0.5 + (i % 3) * 0.5;
      const twinkle = 0.5 + 0.5 * Math.sin(this.time * (1 + i * 0.1) + i);
      ctx.globalAlpha = twinkle * 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawBuildingSilhouettes(ctx, width, height) {
    ctx.save();

    // 建筑配置（带窗户种子）
    const buildings = [
      { x: 20, w: 120, h: 180, base: 500, seed: 7 },
      { x: 160, w: 100, h: 220, base: 500, seed: 13 },
      { x: 340, w: 150, h: 160, base: 500, seed: 23 },
      { x: 510, w: 130, h: 250, base: 500, seed: 31 },
      { x: 660, w: 140, h: 190, base: 500, seed: 47 },
      { x: 840, w: 110, h: 230, base: 500, seed: 53 },
      { x: 970, w: 130, h: 170, base: 500, seed: 59 },
      { x: 1120, w: 140, h: 210, base: 500, seed: 61 },
    ];

    for (const b of buildings) {
      ctx.fillStyle = '#0d0a12';
      ctx.fillRect(b.x, b.base - b.h, b.w, b.h);
      // 窗户（基于种子的确定性亮度）
      let s = b.seed;
      for (let wy = b.base - b.h + 15; wy < b.base - 10; wy += 22) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 18) {
          s = (s * 1103515245 + 12345) & 0x7fffffff;
          const bright = (s / 0x7fffffff) * 0.1;
          if (bright > 0.03) {
            ctx.fillStyle = `rgba(255, 200, 100, ${Math.min(bright, 0.1)})`;
            ctx.fillRect(wx, wy, 8, 12);
          }
        }
      }
      ctx.fillStyle = '#0d0a12';
    }

    ctx.restore();
  }

  drawNoiseOverlay(ctx, width, height) {
    // 底部路面
    const roadGrad = ctx.createLinearGradient(0, height - 80, 0, height);
    roadGrad.addColorStop(0, 'rgba(30, 26, 20, 0)');
    roadGrad.addColorStop(1, 'rgba(30, 26, 20, 0.6)');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, height - 80, width, 80);

    // 边缘暗角
    const vignette = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, 500);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  drawSoundWaves(ctx) {
    for (let i = 0; i < this.sources.length; i++) {
      const source = this.sources[i];
      if (source.found) continue;

      const loud = getSourceLoudness(this.scanPos, source.screenBaseX);
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 3 + source.wavePhase);

      ctx.save();

      // 声源发光点
      const baseRadius = 8 + loud * 12;
      const glow = ctx.createRadialGradient(source.screenBaseX, source.y, 0, source.screenBaseX, source.y, baseRadius * 4);
      glow.addColorStop(0, source.color + '40');
      glow.addColorStop(0.5, source.color + '15');
      glow.addColorStop(1, source.color + '00');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(source.screenBaseX, source.y, baseRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      // 声源中心
      ctx.fillStyle = source.color;
      ctx.globalAlpha = 0.3 + loud * 0.5;
      ctx.beginPath();
      ctx.arc(source.screenBaseX, source.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // 波形扩散圆环
      ctx.strokeStyle = source.color;
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 3; r++) {
        const ringRadius = 25 + r * 20 + pulse * 10;
        ctx.globalAlpha = Math.max(0, 0.3 * (1 - r * 0.25)) * (0.4 + loud * 0.6);
        ctx.beginPath();
        ctx.arc(source.screenBaseX, source.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 波形条（声源下方）
      if (loud > 0.05) {
        ctx.globalAlpha = loud * 0.6;
        const barW = 3;
        const barCount = GATING1_CONFIG.waveBars;
        const totalW = barCount * (barW + 2);
        const startX = source.screenBaseX - totalW / 2;

        for (let b = 0; b < barCount; b++) {
          const barPhase = (b / barCount) * Math.PI * 2 + this.time * 4 + source.wavePhase;
          const barH = Math.max(1, Math.sin(barPhase) * GATING1_CONFIG.maxBarHeight * (0.3 + loud * 0.7));
          ctx.fillStyle = source.color;
          ctx.globalAlpha = (0.15 + loud * 0.45) * (0.5 + 0.5 * Math.sin(barPhase));
          ctx.fillRect(startX + b * (barW + 2), source.y + 15, barW, barH);
          ctx.fillRect(startX + b * (barW + 2), source.y - 15 - barH, barW, barH);
        }
      }

      // 声源提示文字（名称）
      if (loud > 0.2) {
        ctx.globalAlpha = loud * 0.8;
        ctx.fillStyle = source.color;
        ctx.font = '16px system-ui, "PingFang SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(source.label, source.screenBaseX, source.y - baseRadius - 8);

        // 提示文本
        ctx.fillStyle = '#c0b0a0';
        ctx.font = '13px system-ui, "PingFang SC", sans-serif';
        ctx.globalAlpha = loud * 0.5;
        ctx.fillText(source.hint, source.screenBaseX, source.y - baseRadius - 32);
      }

      ctx.restore();
    }

    // 已找到的声源 — 金色标记
    for (const source of this.sources) {
      if (!source.found) continue;
      ctx.save();
      ctx.fillStyle = '#f0c040';
      ctx.globalAlpha = 0.4 + 0.3 * Math.sin(this.time * 2);
      ctx.font = '28px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', source.screenBaseX, source.y);

      // 金色光圈
      ctx.strokeStyle = '#f0c040';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.2 + 0.15 * Math.sin(this.time * 2.5);
      ctx.beginPath();
      ctx.arc(source.screenBaseX, source.y, 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawScanLine(ctx, width, height) {
    ctx.save();

    // 扫描线 — 从下方照射的柔和光柱
    const scanGrad = ctx.createLinearGradient(this.scanPos - 100, height, this.scanPos, height - 60);
    scanGrad.addColorStop(0, 'rgba(200, 180, 150, 0)');
    scanGrad.addColorStop(0.3, 'rgba(200, 180, 150, 0.06)');
    scanGrad.addColorStop(0.7, 'rgba(200, 180, 150, 0.03)');
    scanGrad.addColorStop(1, 'rgba(200, 180, 150, 0)');

    ctx.fillStyle = scanGrad;
    ctx.beginPath();
    ctx.moveTo(this.scanPos, height);
    ctx.lineTo(this.scanPos - 60, height - 100);
    ctx.lineTo(this.scanPos + 60, height - 100);
    ctx.closePath();
    ctx.fill();

    // 扫描线指示小点（底部）
    ctx.fillStyle = 'rgba(200, 180, 150, 0.3)';
    ctx.beginPath();
    ctx.arc(this.scanPos, height - 70, 4, 0, Math.PI * 2);
    ctx.fill();

    // 左右箭头（拖动示意）
    if (this.sourcesFound < 3) {
      ctx.fillStyle = 'rgba(200, 180, 150, 0.15)';
      ctx.font = '24px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◀', 30, height / 2);
      ctx.fillText('▶', width - 30, height / 2);
    }

    ctx.restore();
  }

  drawCompass(ctx, width) {
    const cx = width / 2;
    const cy = 40;
    const radius = 30;

    ctx.save();

    // 背景圆盘
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // 外圈
    ctx.strokeStyle = 'rgba(200, 180, 150, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 声源标记
    for (let i = 0; i < this.sources.length; i++) {
      const source = this.sources[i];
      // 将声源的 screenBaseX 映射到 360° 圆盘上
      const angle = (source.screenBaseX / 1280) * Math.PI * 2 - Math.PI / 2;
      const dotR = radius - 6;
      const dx = cx + Math.cos(angle) * dotR;
      const dy = cy + Math.sin(angle) * dotR;

      ctx.fillStyle = source.found ? '#f0c040' : source.color;
      ctx.globalAlpha = source.found ? 0.8 : 0.4;
      ctx.beginPath();
      ctx.arc(dx, dy, source.found ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 扫描指示三角（当前位置）
    const scanAngle = (this.scanPos / 1280) * Math.PI * 2 - Math.PI / 2;
    const innerR = 6;
    ctx.save();
    ctx.translate(cx + Math.cos(scanAngle) * innerR, cy + Math.sin(scanAngle) * innerR);
    ctx.rotate(scanAngle);
    ctx.fillStyle = '#f0d090';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  drawLockProgress(ctx) {
    if (!this.isLocking || this.lockTargetIdx < 0) return;

    const source = this.sources[this.lockTargetIdx];
    const progress = source.lockProgress;

    ctx.save();

    const cx = source.screenBaseX;
    const cy = source.y;
    const ringR = 36;

    // 背景环
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();

    // 进度环
    ctx.strokeStyle = source.color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.stroke();

    // 百分比文字
    ctx.fillStyle = source.color;
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.7;
    ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy);

    ctx.restore();
  }

  drawCelebration(ctx, width, height) {
    const alpha = Math.min(1, this.phaseTime / 0.5) * (1 - Math.min(1, (this.phaseTime - 0.5) / 1.5));
    ctx.save();
    ctx.globalAlpha = alpha;

    // 金色粒子（基于时间的确定性位置）
    for (let i = 0; i < 20; i++) {
      const t = this.phaseTime * 10 + i * 193.7;
      const angle = t % (Math.PI * 2);
      const dist = (i * 37.1 + this.phaseTime * 40) % 220 + 20;
      const px = width / 2 + Math.cos(angle) * dist;
      const py = height / 2 + Math.sin(angle * 0.7) * dist * 0.6;
      const size = 1 + (i % 3);
      ctx.fillStyle = '#f0c040';
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f0c040';
    ctx.font = 'bold 32px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('记忆解锁 +5%', width / 2, height / 2);

    ctx.restore();
  }

  // ---------- Gating 2：电梯按钮迷宫 ----------

  renderGating2(ctx) {
    const { width, height } = this.game;

    // 1. 电梯背景
    this.drawElevatorBg(ctx, width, height);

    // 2. 电梯面板
    this.drawElevatorPanel(ctx);

    // 3. 按钮
    for (let i = 0; i < ELEVATOR_BUTTONS.length; i++) {
      this.drawElevatorButton(ctx, i);
    }

    // 4. AI 提示
    this.drawAIHint(ctx, width);

    // 5. 错误反馈
    if (this.errorTimer > 0) {
      ctx.save();
      ctx.globalAlpha = this.errorTimer / 0.4;
      const rect = getButtonRect(this.errorBtnIdx);
      ctx.fillStyle = 'rgba(200, 40, 30, 0.25)';
      roundedRect(ctx, rect.x - 4, rect.y - 4, rect.w + 8, rect.h + 8, 10);
      ctx.fill();
      ctx.strokeStyle = `rgba(200, 40, 30, ${this.errorTimer / 0.4})`;
      ctx.lineWidth = 2;
      roundedRect(ctx, rect.x - 4, rect.y - 4, rect.w + 8, rect.h + 8, 10);
      ctx.stroke();
      ctx.restore();
    }

    // 6. 底部提示
    drawPrompt(ctx, '点击有向日葵标记的楼层按钮', width / 2, height - 30, 0);
  }

  drawElevatorBg(ctx, width, height) {
    // 电梯内部
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#3a3835');
    grad.addColorStop(0.3, '#4a4845');
    grad.addColorStop(0.5, '#504e4b');
    grad.addColorStop(0.7, '#4a4845');
    grad.addColorStop(1, '#3a3835');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 顶部灯带
    const lightGrad = ctx.createLinearGradient(0, 0, width, 0);
    lightGrad.addColorStop(0, 'rgba(255, 240, 200, 0.1)');
    lightGrad.addColorStop(0.2, 'rgba(255, 240, 200, 0.25)');
    lightGrad.addColorStop(0.5, 'rgba(255, 240, 200, 0.3)');
    lightGrad.addColorStop(0.8, 'rgba(255, 240, 200, 0.25)');
    lightGrad.addColorStop(1, 'rgba(255, 240, 200, 0.1)');
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, width, 12);

    // 电梯门缝线（左右两侧）
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 0); ctx.lineTo(10, height);
    ctx.moveTo(width - 10, 0); ctx.lineTo(width - 10, height);
    ctx.stroke();

    // 楼层显示器（左上角）
    this.drawFloorDisplay(ctx);
  }

  drawFloorDisplay(ctx, floorLabel) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    roundedRect(ctx, 20, 20, 100, 40, 4);
    ctx.fill();

    ctx.fillStyle = '#40c040';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    ctx.fillText(floorLabel || '1F', 36, 40);

    // 闪烁的向上箭头
    ctx.fillStyle = `rgba(64, 192, 64, ${0.3 + 0.3 * Math.sin(this.time * 2)})`;
    ctx.font = '14px system-ui';
    ctx.fillText('▲', 90, 40);

    ctx.restore();
  }

  drawElevatorPanel(ctx) {
    const cfg = ELEVATOR_CONFIG;

    ctx.save();

    // 面板背景
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;

    const panelGrad = ctx.createLinearGradient(cfg.panelX, cfg.panelY, cfg.panelX, cfg.panelY + cfg.panelHeight);
    panelGrad.addColorStop(0, '#2a2825');
    panelGrad.addColorStop(0.5, '#353330');
    panelGrad.addColorStop(1, '#2a2825');
    ctx.fillStyle = panelGrad;
    roundedRect(ctx, cfg.panelX, cfg.panelY, cfg.panelWidth, cfg.panelHeight, 16);
    ctx.fill();

    // 面板边框
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(100,95,85,0.5)';
    ctx.lineWidth = 1.5;
    roundedRect(ctx, cfg.panelX, cfg.panelY, cfg.panelWidth, cfg.panelHeight, 16);
    ctx.stroke();

    // 面板顶部文字
    ctx.fillStyle = '#706860';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('▲ 楼层选择 ▼', cfg.panelX + cfg.panelWidth / 2, cfg.panelY + 18);

    ctx.restore();
  }

  drawElevatorButton(ctx, idx) {
    const cfg = ELEVATOR_CONFIG;
    const btnData = ELEVATOR_BUTTONS[idx];
    const rect = getButtonRect(idx);
    const isHovered = this.hoveredBtn === idx;
    const isCorrect = idx === cfg.correctIndex;

    ctx.save();

    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;

    // 悬停高亮
    if (isHovered) {
      ctx.shadowColor = '#f0c040';
      ctx.shadowBlur = 12;
    }

    // 按钮背景
    const btnGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, rect.w / 2);
    btnGrad.addColorStop(0, isCorrect ? '#4a4845' : '#403e3b');
    btnGrad.addColorStop(1, '#2a2825');
    ctx.fillStyle = btnGrad;
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fill();

    // 按钮边框
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isCorrect ? 'rgba(240, 192, 64, 0.2)' : 'rgba(80,75,65,0.6)';
    ctx.lineWidth = 1.5;
    roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.stroke();

    // 扭曲数字
    this.drawDistortedNumber(ctx, btnData, cx, cy);

    // 向日葵花瓣（仅正确按钮）
    if (btnData.hasSunflower) {
      this.drawSunflowerPetals(ctx, cx, cy, cfg);
    }

    ctx.restore();
  }

  drawDistortedNumber(ctx, btnData, cx, cy) {
    ctx.save();

    ctx.translate(cx + (btnData.offsetX || 0), cy + (btnData.offsetY || 0));

    // 旋转变换
    const rad = (btnData.rotation || 0) * Math.PI / 180;
    ctx.rotate(rad);

    // 非均匀缩放
    ctx.scale(btnData.scaleX || 1, btnData.scaleY || 1);

    // 文字
    ctx.fillStyle = '#c8c0b0';
    ctx.font = 'bold 40px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 阴影
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;

    ctx.fillText(btnData.label, 0, 0);

    ctx.restore();
  }

  drawSunflowerPetals(ctx, cx, cy, cfg) {
    ctx.save();

    const petalCount = cfg.sunflowerPetals;
    const radius = cfg.sunflowerRadius;
    const pLen = cfg.petalLen;
    const pWidth = cfg.petalWidth;

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2 + Math.PI / 8;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle + Math.PI / 2);

      // 花瓣
      const alpha = 0.35 + 0.15 * Math.sin(this.time * 1.5 + i * 0.8);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#f0c040';
      ctx.beginPath();
      ctx.ellipse(0, 0, pWidth, pLen, 0, 0, Math.PI * 2);
      ctx.fill();

      // 花瓣高光
      ctx.fillStyle = '#f5d76e';
      ctx.beginPath();
      ctx.ellipse(0, -pLen * 0.2, pWidth * 0.5, pLen * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 花芯（小圆点）
    ctx.fillStyle = '#c0a030';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawAIHint(ctx, width) {
    ctx.save();

    // 右上角 AI 管家提示
    const hintX = width - 20;
    const hintY = 50;

    // 提示框
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    const hintW = 280;
    const hintH = 80;
    roundedRect(ctx, hintX - hintW, hintY - 10, hintW, hintH, 10);
    ctx.fill();

    // 边框
    ctx.strokeStyle = 'rgba(240, 192, 64, 0.3)';
    ctx.lineWidth = 1;
    roundedRect(ctx, hintX - hintW, hintY - 10, hintW, hintH, 10);
    ctx.stroke();

    // 标题
    ctx.fillStyle = '#f0c040';
    ctx.font = '14px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('AI 管家', hintX - 12, hintY + 4);

    // 提示文字
    ctx.fillStyle = '#d4c8b8';
    ctx.font = '15px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('"您的家在有向日葵贴纸的那一层。"', hintX - 12, hintY + 30);

    ctx.restore();
  }

  // ---------- Gating 2：电梯上升动画 ----------

  renderGating2Elevating(ctx) {
    const { width, height } = this.game;

    // 随着电梯上升，面板向上移动
    ctx.save();

    // 背景还是电梯内部
    this.drawElevatorBg(ctx, width, height);

    // 面板上移
    ctx.translate(0, -this.elevateOffset);
    this.drawElevatorPanel(ctx);
    for (let i = 0; i < ELEVATOR_BUTTONS.length; i++) {
      // 只画正确的按钮（别的慢慢消失）
      if (i === ELEVATOR_CONFIG.correctIndex || this.phaseTime < 0.5) {
        this.drawElevatorButton(ctx, i);
      }
    }
    ctx.restore();

    // 成功发光渐隐
    if (this.successFlash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(240, 192, 64, ${this.successFlash * 0.15})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 震动效果
    const shake = this.phaseTime < 1 ? Math.sin(this.phaseTime * 40) * 3 : 0;
    ctx.fillStyle = '#d4b896';
    ctx.font = 'bold 36px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 楼层变化数字
    const floor = Math.min(1 + Math.floor(this.phaseTime / 0.4), 6);
    ctx.fillText(`${floor}F`, width / 2 + shake, height / 2 - 40);

    ctx.fillStyle = '#a09080';
    ctx.font = '20px system-ui, "PingFang SC", sans-serif';
    ctx.fillText('电梯缓缓上升……', width / 2 + shake, height / 2 + 20);
  }

  // ---------- 章节完成 ----------

  renderComplete(ctx) {
    const { width, height } = this.game;
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, width, height);

    const alpha = Math.min(1, this.phaseTime / 1);

    ctx.save();
    ctx.globalAlpha = alpha;

    ctx.fillStyle = '#d4b896';
    ctx.font = 'bold 36px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('记忆中……有什么被唤醒了。', width / 2, height / 2 - 30);

    ctx.fillStyle = '#8a7a6a';
    ctx.font = '20px system-ui, "PingFang SC", sans-serif';
    ctx.fillText('记忆解锁：35%', width / 2, height / 2 + 30);

    ctx.restore();
  }
}
