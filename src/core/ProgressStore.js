/**
 * ProgressStore — localStorage 进度读写
 * key 前缀 ye_v1_，符合开发规范 v1.0
 */

const PREFIX = 'ye_v1_';

export class ProgressStore {
  /**
   * 保存值
   * @param {string} key   — 不带前缀的键名，如 'progress'
   * @param {*} value — JSON 可序列化
   */
  save(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      // localStorage 不可用（隐私模式/存储满），静默失败
    }
  }

  /**
   * 读取值
   * @param {string} key       — 不带前缀的键名
   * @param {*} [defaultVal]   — 不存在时返回的默认值
   * @returns {*}
   */
  load(key, defaultVal = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return defaultVal;
      return JSON.parse(raw);
    } catch (e) {
      return defaultVal;
    }
  }

  /**
   * 删除键
   */
  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) { /* 静默 */ }
  }

  /**
   * 清除所有 ye_v1_ 前缀的数据
   */
  clearAll() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) { /* 静默 */ }
  }
}
