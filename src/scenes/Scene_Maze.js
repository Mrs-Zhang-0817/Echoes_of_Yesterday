import { drawImageCover, drawPrompt, roundedRect } from './sceneUtils.js';
import { MAZE_CONFIG, validatePath, hitStart, getNode } from './mazeLayout.js';

export class SceneMaze {
  constructor(game) {
    this.game = game;
    this.points = [];          // 触摸点序列
    this.phase = 'idle';       // idle | drawing | wrong | success | complete
    this.phaseTime = 0;
    this.completionLogged = false;
    this.hoveredNode = null;   // 当前悬停的节点 id
    this.debug = false;

    // 重置按钮（右下角 — 横向宽区域，视觉隐藏）
    this.resetBtn = { x: 880, y: 620, w: 380, h: 80 };
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

  handleDown(point) {
    // 检查是否点击了重置按钮
    if (this.hitResetBtn(point.x, point.y)) {
      this.resetRoute();
      return;
    }
    if (this.phase !== 'idle') return;
    if (!hitStart(point.x, point.y)) return;
    this.points = [point];
    this.phase = 'drawing';
  }

  handleMove(point) {
    // 始终更新悬停节点
    this.updateHover(point);

    if (this.phase !== 'drawing') return;
    this.points.push(point);
    // 每帧检测死胡同 — 一碰到立刻失败
    const result = validatePath(this.points);
    if (result.hitWrong) {
      this.phase = 'wrong';
      this.phaseTime = 0;
      navigator.vibrate?.(30);
    }
  }

  handleUp(point) {
    if (this.phase === 'idle') return;
    if (this.phase !== 'drawing') return;
    // 只有有移动才校验
    if (this.points.length < 3) {
      this.points = [];
      this.phase = 'idle';
      return;
    }
    this.points.push(point);
    const result = validatePath(this.points);
    if (result.success) {
      this.phase = 'success';
      this.phaseTime = 0;
      navigator.vibrate?.(15);
    } else if (!result.hitWrong) {
      // 未到达终点也没撞死胡同 = 画到半路松手 → 失败
      this.phase = 'wrong';
      this.phaseTime = 0;
    }
  }

  handleCancel() {
    this.points = [];
    this.phase = 'idle';
    this.phaseTime = 0;
  }

  resetRoute() {
    this.points = [];
    this.phase = 'idle';
    this.phaseTime = 0;
    navigator.vibrate?.(10);
  }

  hitResetBtn(x, y) {
    const b = this.resetBtn;
    return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
  }

  updateHover(point) {
    if (this.phase !== 'drawing' && this.phase !== 'idle') {
      this.hoveredNode = null;
      return;
    }
    this.hoveredNode = null;
    // 检测靠近哪个节点（正确路径 + 误导路径）
    for (const node of MAZE_CONFIG.nodes) {
      if (Math.hypot(point.x - node.x, point.y - node.y) <= MAZE_CONFIG.nodeRadius) {
        this.hoveredNode = node.id;
        return;
      }
    }
    for (const decoy of (MAZE_CONFIG.decoys || [])) {
      if (Math.hypot(point.x - decoy.x, point.y - decoy.y) <= MAZE_CONFIG.nodeRadius) {
        this.hoveredNode = decoy.id;
        return;
      }
    }
  }

  update(dt) {
    if (this.phase === 'wrong') {
      this.phaseTime += dt;
      if (this.phaseTime >= 0.8) {
        this.points = [];
        this.phase = 'idle';
        this.phaseTime = 0;
      }
    } else if (this.phase === 'success') {
      this.phaseTime += dt;
      if (this.phaseTime >= 1.8 && !this.completionLogged) {
        this.completionLogged = true;
        this.game.onMazeComplete?.();
      }
    }
  }

  // ====== 渲染 ======
  render(ctx) {
    const { width, height } = this.game;

    // 1. 深色背景
    ctx.fillStyle = '#100c09';
    ctx.fillRect(0, 0, width, height);

    // 2. 地图图片
    if (this.game.images.mazeMap) {
      drawImageCover(ctx, this.game.images.mazeMap, width, height);
    }

    // 3. 悬停高亮（光标触碰节点时）
    this.drawHoverNode(ctx);

    // 4. 玩家画的线
    this.drawPlayerLine(ctx);

    // 5. 错误红色覆盖
    if (this.phase === 'wrong') {
      const flash = Math.sin(this.phaseTime * 14) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(180, 40, 30, ${flash * 0.25})`;
      ctx.fillRect(0, 0, width, height);

      const lastPt = this.points[this.points.length - 1];
      if (lastPt) {
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 50, 40, ${flash * 0.7})`;
        ctx.fill();
      }
    }

    // 6. 重置按钮（右下角）
    this.drawResetBtn(ctx);

    // 7. 提示文字
    if (this.phase === 'idle') {
      drawPrompt(ctx, '从起点画一条路线到希望小学', width / 2, height - 45, 0);
    } else if (this.phase === 'wrong') {
      drawPrompt(ctx, '再试试吧', width / 2, height - 45, 0.4);
    } else if (this.phase === 'success') {
      drawPrompt(ctx, '谢谢你，我要赶紧去接姑娘了', width / 2, height - 45, 0.4);
    }
  }

  drawHoverNode(ctx) {
    if (!this.hoveredNode || this.phase === 'success' || this.phase === 'complete') return;

    let node = MAZE_CONFIG.nodes.find(n => n.id === this.hoveredNode);
    let isDecoy = false;
    if (!node) {
      node = MAZE_CONFIG.decoys.find(d => d.id === this.hoveredNode);
      isDecoy = !!node;
    }
    if (!node) return;

    const isStart = node.type === 'start';
    const isEnd = node.type === 'end';

    // 外圈发光 — 误导节点也用金色
    ctx.save();
    ctx.shadowColor = isEnd ? '#e05545' : '#f0c040';
    ctx.shadowBlur = 22;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = isStart ? 'rgba(76,175,80,0.6)'
      : isEnd ? 'rgba(244,67,54,0.55)'
      : 'rgba(240,192,64,0.55)';
    ctx.fill();
    ctx.restore();

    // 标签 — 只显示起点和终点
    const label = isStart ? '我的位置' : isEnd ? '希望小学' : '';
    if (label) {
      ctx.save();
      ctx.font = 'bold 14px system-ui, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      const tw = ctx.measureText(label).width;
      const pad = 8;
      const tx = node.x;
      const ty = node.y - 26;
      roundedRect(ctx, tx - tw / 2 - pad, ty - 24, tw + pad * 2, 28, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(label, tx, ty - 2);
      ctx.restore();
    }
  }

  drawResetBtn(ctx) {
    // 视觉隐藏，保留点击区域
    // 重置区域已由 this.resetBtn 定义
  }

  drawPlayerLine(ctx) {
    if (this.points.length < 2) return;

    const isWrong = this.phase === 'wrong';
    const alpha = isWrong ? Math.max(0, 1 - this.phaseTime / 0.8) : 1;

    ctx.save();
    ctx.globalAlpha = alpha;

    // 画路径发光
    ctx.shadowColor = isWrong ? '#c03020' : '#e8a840';
    ctx.shadowBlur = isWrong ? 10 : 14;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.strokeStyle = isWrong ? '#d04030' : '#f0b848';
    ctx.lineWidth = isWrong ? 5 : 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 内层亮线（无阴影）
    ctx.shadowBlur = 0;
    ctx.strokeStyle = isWrong ? '#e06050' : '#ffd070';
    ctx.lineWidth = isWrong ? 3 : 4;
    ctx.stroke();

    ctx.restore();
  }

  drawDebugOverlay(ctx) {
    // 绘制所有节点检测圆
    for (const node of MAZE_CONFIG.nodes) {
      const isStart = node.type === 'start';
      const isEnd = node.type === 'end';
      ctx.beginPath();
      ctx.arc(node.x, node.y, MAZE_CONFIG.nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = isStart ? 'rgba(76, 175, 80, 0.25)'
        : isEnd ? 'rgba(244, 67, 54, 0.25)'
        : 'rgba(76, 175, 80, 0.15)';
      ctx.fill();
      ctx.strokeStyle = isStart ? '#4caf50' : isEnd ? '#f44336' : '#4caf50';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 死胡同检测圆
    for (const dead of MAZE_CONFIG.deadEnds) {
      ctx.beginPath();
      ctx.arc(dead.x, dead.y, MAZE_CONFIG.nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 67, 54, 0.15)';
      ctx.fill();
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 正确路径连线
    ctx.save();
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    for (let i = 0; i < MAZE_CONFIG.correctPath.length - 1; i++) {
      const from = MAZE_CONFIG.nodes.find(n => n.id === MAZE_CONFIG.correctPath[i]);
      const to = MAZE_CONFIG.nodes.find(n => n.id === MAZE_CONFIG.correctPath[i + 1]);
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 节点名
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (const node of MAZE_CONFIG.nodes) {
      ctx.fillText(`${node.id}`, node.x + MAZE_CONFIG.nodeRadius + 4, node.y + 4);
    }
    for (const dead of MAZE_CONFIG.deadEnds) {
      ctx.fillStyle = 'rgba(244,67,54,0.5)';
      ctx.fillText(dead.id, dead.x + MAZE_CONFIG.nodeRadius + 4, dead.y + 4);
    }
  }
}
