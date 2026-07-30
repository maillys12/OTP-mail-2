const MAILLY_API_URL = "https://script.google.com/macros/s/AKfycbwvodWTq0b4Ct7YLi-BBx8KHw5UBzW14bhH2PQVjAwC3e98VHLGgQf39GKY2nYpBhhU/exec";
const MAILLY_BACKEND_VERSION = "2026.07.30-country-v4";
const MAILLY_TOKEN_KEY = "mailly_session_token";
const MAILLY_CACHE_PREFIX = "mailly_cache_";
const MAILLY_SAVED_TOKEN = localStorage.getItem(MAILLY_TOKEN_KEY) || "";

function readMaillyCache(key, maxAge = 0) {
  try {
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (!cached || !Object.prototype.hasOwnProperty.call(cached, "data")) return null;
    if (maxAge && Date.now() - Number(cached.savedAt || 0) > maxAge) return null;
    return cached.data;
  } catch (_) {
    return null;
  }
}

const Mailly = {
  token: MAILLY_SAVED_TOKEN,
  user: MAILLY_SAVED_TOKEN ? readMaillyCache(MAILLY_CACHE_PREFIX + "user") : null,

  cacheKey(name) {
    const username = String(this.user?.username || "guest").toLowerCase();
    return `${MAILLY_CACHE_PREFIX}${username}_${name}`;
  },

  getCache(name, maxAge = 0) {
    return readMaillyCache(this.cacheKey(name), maxAge);
  },

  setCache(name, data) {
    try {
      localStorage.setItem(this.cacheKey(name), JSON.stringify({ savedAt: Date.now(), data }));
    } catch (_) {}
    return data;
  },

  setUser(user) {
    this.user = user || null;
    try {
      if (this.user) {
        localStorage.setItem(MAILLY_CACHE_PREFIX + "user", JSON.stringify({ savedAt: Date.now(), data: this.user }));
      } else {
        localStorage.removeItem(MAILLY_CACHE_PREFIX + "user");
      }
    } catch (_) {}
    this.renderAccount();
    return this.user;
  },

  async api(action, payload = {}) {
    const response = await fetch(MAILLY_API_URL, {
      method: "POST",
      body: JSON.stringify({
        action,
        payload: { ...payload, token: this.token }
      })
    });
    const data = await response.json();
    if (!data.success && /Session|เข้าสู่ระบบใหม่/.test(data.message || "")) {
      this.clearSession();
      location.href = "index.html";
      throw new Error(data.message || "Session หมดอายุ");
    }
    return data;
  },

  async requireUser() {
    if (!this.token) {
      location.href = "index.html";
      throw new Error("กรุณาเข้าสู่ระบบ");
    }
    if (this.user) {
      this.renderAccount();
      void this.refreshUser().catch(() => {});
      return this.user;
    }
    return this.refreshUser();
  },

  async refreshUser() {
    const result = await this.api("getSessionUser");
    if (!result.success || !result.user) throw new Error(result.message || "ไม่สามารถตรวจสอบบัญชีได้");
    return this.setUser(result.user);
  },

  renderAccount() {
    if (!this.user) return;
    const username = document.querySelector("[data-mailly-username]");
    const avatar = document.querySelector("[data-mailly-avatar]");
    const balance = document.querySelector("[data-mailly-balance]");
    if (username) username.textContent = this.user.username;
    if (avatar) avatar.textContent = this.user.username.charAt(0).toUpperCase();
    if (balance) balance.textContent = Number(this.user.balance || 0).toFixed(2) + " ฿";
  },

  setBalance(value) {
    if (this.user) this.user.balance = Number(value) || 0;
    this.setUser(this.user);
  },

  clearSession() {
    this.token = "";
    this.user = null;
    localStorage.removeItem(MAILLY_TOKEN_KEY);
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(MAILLY_CACHE_PREFIX)) localStorage.removeItem(key);
    });
  },

  escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);
  }
};

Mailly.renderAccount();
