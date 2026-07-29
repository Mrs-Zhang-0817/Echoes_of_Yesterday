/**
 * ChapterManager — 章节注册/切换/fade 过渡
 * 替代旧 SceneManager，接口对齐开发规范 v1.0
 *
 * 用法：
 *   game.chapterManager.register('ch05_door', Chapter05);
 *   game.chapterManager.switchTo('ch05_door');
 *   game.chapterManager.next();   // 跳转到下一章（根据注册顺序）
 */

export class ChapterManager {
  constructor(game) {
    this.game = game;
    this.registry = [];       // [{ name, Class }]
    this.currentIndex = -1;
    this.currentChapter = null;
    this.pendingName = null;
    this.transition = { phase: 'idle', alpha: 0, duration: 0.3 };
  }

  /**
   * 注册章节
   * @param {string} name  — 唯一标识，如 'ch05_door'
   * @param {Function} Class — ChapterNN 构造函数
   */
  register(name, Class) {
    if (this.registry.find(e => e.name === name)) return;
    this.registry.push({ name, Class });
  }

  /**
   * 切换到指定章节
   */
  switchTo(name) {
    const entry = this.registry.find(e => e.name === name);
    if (!entry) {
      console.warn(`ChapterManager: chapter "${name}" not registered`);
      return;
    }
    if (!this.currentChapter) {
      this.activate(entry);
      this.transition = { ...this.transition, phase: 'in', alpha: 1, duration: 0.3 };
      return;
    }
    this.pendingName = name;
    this.transition.phase = 'out';
  }

  /**
   * 切换到下一章（按注册顺序）
   */
  next() {
    if (this.currentIndex < 0 || this.currentIndex >= this.registry.length - 1) {
      console.info('ChapterManager: no next chapter');
      return;
    }
    this.switchTo(this.registry[this.currentIndex + 1].name);
  }

  /**
   * 获取当前章节在注册表中的索引
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * 获取总章节数
   */
  getTotalCount() {
    return this.registry.length;
  }

  activate(entry) {
    this.currentChapter?.onExit?.();
    this.currentIndex = this.registry.indexOf(entry);
    this.currentChapter = new entry.Class(this.game);
    this.currentChapter.onEnter?.();
  }

  update(dt) {
    this.currentChapter?.update?.(dt);

    if (this.transition.phase === 'out') {
      this.transition.alpha += dt / this.transition.duration;
      if (this.transition.alpha >= 1) {
        this.transition.alpha = 1;
        const entry = this.registry.find(e => e.name === this.pendingName);
        if (entry) this.activate(entry);
        this.pendingName = null;
        this.transition.phase = 'in';
      }
    } else if (this.transition.phase === 'in') {
      this.transition.alpha -= dt / this.transition.duration;
      if (this.transition.alpha <= 0) {
        this.transition.alpha = 0;
        this.transition.phase = 'idle';
      }
    }
  }

  renderTransition(ctx) {
    if (this.transition.alpha <= 0) return;
    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${this.transition.alpha})`;
    ctx.fillRect(0, 0, this.game.width, this.game.height);
    ctx.restore();
  }
}
