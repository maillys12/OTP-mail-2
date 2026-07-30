const MAILLY_API_URL = "https://script.google.com/macros/s/AKfycbwGFdUowXZNnlomFjfcrnEMVf9hbYKjsi1wVQt938VgaKz8RbbrgKILxD9rbVos913j/exec";
const MAILLY_TOKEN_KEY = "mailly_session_token";

const Mailly = {
  token: localStorage.getItem(MAILLY_TOKEN_KEY) || "",
  user: null,

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
    const result = await this.api("getSessionUser");
    if (!result.success) throw new Error(result.message || "ไม่สามารถตรวจสอบบัญชีได้");
    this.user = result.user;
    this.renderAccount();
    return this.user;
  },

  renderAccount() {
    const username = document.querySelector("[data-mailly-username]");
    const avatar = document.querySelector("[data-mailly-avatar]");
    const balance = document.querySelector("[data-mailly-balance]");
    if (username) username.textContent = this.user.username;
    if (avatar) avatar.textContent = this.user.username.charAt(0).toUpperCase();
    if (balance) balance.textContent = Number(this.user.balance || 0).toFixed(2) + " ฿";
  },

  setBalance(value) {
    if (this.user) this.user.balance = Number(value) || 0;
    this.renderAccount();
  },

  clearSession() {
    this.token = "";
    this.user = null;
    localStorage.removeItem(MAILLY_TOKEN_KEY);
  },

  escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[c]);
  }
};
