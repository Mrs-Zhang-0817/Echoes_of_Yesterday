export class Game {
  constructor(game) {
    this.game = game;
    this.lastTime = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(ts => this.loop(ts));
  }

  loop(timestamp) {
    if (!this.running) return;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.game.chapterManager.update(dt);
    this.game.ctx.clearRect(0, 0, this.game.width, this.game.height);

    // 始终渲染当前章节（弹层遮罩叠在上面）
    this.game.chapterManager.currentChapter?.render(this.game.ctx);
    this.game.chapterManager.renderTransition(this.game.ctx);
    this.game.overlay.render(this.game.ctx);
    requestAnimationFrame(next => this.loop(next));
  }
}
