/**
 * Overlay — Canvas 自绘弹层
 * 全屏半透明黑色遮罩 + 居中圆角卡片
 * 同一时间只允许一个弹层激活
 *
 * 用法：
 *   game.overlay.show({ type, title, message, buttons })
 *   game.overlay.hide()
 *
 * button.action 可以：
 *   - 直接调用：() => game.chapterManager.next()
 *   - 调用 game.overlay.hide() 关弹层
 */

const OVERLAY_TYPES = {
  prompt: { titleColor: '#d4b896', messageColor: '#a09080' },
  complete: { titleColor: '#f0c040', messageColor: '#d4b896' },
  error: { titleColor: '#e05545', messageColor: '#c0a090' },
};

export class Overlay {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.data = null;
    this.hoverBtn = -1;
    this.btnRegions = [];
    this._savedHandlers = null;
    this._boundDown = (point) => this.handleClick(point);
    this._boundMove = (point) => this.handleMove(point);
  }

  show(opts) {
    if (this.active) this.hide();
    this.active = true;
    this.data = {
      type: opts.type || 'prompt',
      title: opts.title || '',
      message: opts.message || '',
      buttons: opts.buttons || [],
    };
    this.hoverBtn = -1;
    this.btnRegions = [];

    // 保存当前章节 handler，接管输入
    this._savedHandlers = { ...this.game.input.handlers };
    this.game.input.setHandlers({
      down: this._boundDown,
      move: this._boundMove,
    });
  }

  hide() {
    if (!this.active) return;
    this.active = false;
    this.data = null;
    this.hoverBtn = -1;
    this.btnRegions = [];

    if (this._savedHandlers) {
      this.game.input.setHandlers(this._savedHandlers);
      this._savedHandlers = null;
    }
  }

  handleClick(point) {
    if (!this.active) return;
    for (let i = 0; i < this.btnRegions.length; i++) {
      const r = this.btnRegions[i];
      if (point.x >= r.x && point.x <= r.x + r.w && point.y >= r.y && point.y <= r.y + r.h) {
        const action = this.data.buttons[i]?.action;
        if (action) action();
        return;
      }
    }
  }

  handleMove(point) {
    if (!this.active) return;
    this.hoverBtn = -1;
    for (let i = 0; i < this.btnRegions.length; i++) {
      const r = this.btnRegions[i];
      if (point.x >= r.x && point.x <= r.x + r.w && point.y >= r.y && point.y <= r.y + r.h) {
        this.hoverBtn = i;
        return;
      }
    }
  }

  render(ctx) {
    if (!this.active || !this.data) return;

    const { width, height } = this.game;
    const style = OVERLAY_TYPES[this.data.type] || OVERLAY_TYPES.prompt;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, width, height);

    const cardW = 520;
    const cardH = 220 + this.data.buttons.length * 60;
    const cx = (width - cardW) / 2;
    const cy = (height - cardH) / 2;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 6;
    this._roundedRect(ctx, cx, cy, cardW, cardH, 16);
    ctx.fillStyle = '#1a1612';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(212, 184, 150, 0.2)';
    ctx.lineWidth = 1;
    this._roundedRect(ctx, cx, cy, cardW, cardH, 16);
    ctx.stroke();

    ctx.fillStyle = style.titleColor;
    ctx.font = 'bold 26px system-ui, "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(this.data.title, width / 2, cy + 32);

    if (this.data.message) {
      ctx.fillStyle = style.messageColor;
      ctx.font = '18px system-ui, "PingFang SC", sans-serif';
      ctx.fillText(this.data.message, width / 2, cy + 76);
    }

    this.btnRegions = [];
    const btnW = 200;
    const btnH = 48;
    const btnStartY = cy + cardH - 30 - this.data.buttons.length * (btnH + 12);
    for (let i = 0; i < this.data.buttons.length; i++) {
      const btn = this.data.buttons[i];
      const bx = (width - btnW) / 2;
      const by = btnStartY + i * (btnH + 12);
      this.btnRegions.push({ x: bx, y: by, w: btnW, h: btnH });

      const isHover = this.hoverBtn === i;
      const grad = ctx.createLinearGradient(bx, by, bx, by + btnH);
      grad.addColorStop(0, isHover ? '#4a3a28' : '#3a2e1e');
      grad.addColorStop(1, isHover ? '#3a2e1e' : '#2a2218');
      ctx.fillStyle = grad;
      this._roundedRect(ctx, bx, by, btnW, btnH, 8);
      ctx.fill();

      ctx.strokeStyle = isHover ? 'rgba(240, 192, 64, 0.5)' : 'rgba(212, 184, 150, 0.2)';
      ctx.lineWidth = 1;
      this._roundedRect(ctx, bx, by, btnW, btnH, 8);
      ctx.stroke();

      ctx.fillStyle = isHover ? '#f0c040' : '#d4b896';
      ctx.font = '17px system-ui, "PingFang SC", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.text, width / 2, by + btnH / 2);
    }

    ctx.restore();
  }

  _roundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
}
