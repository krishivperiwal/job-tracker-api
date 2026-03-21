import { clearToken, getToken, setMessage, setToken } from "./apiClient.js";

const tokenField = document.getElementById("tokenField");
const saveBtn = document.getElementById("saveTokenBtn");
const clearBtn = document.getElementById("clearTokenBtn");
const message = document.getElementById("tokenMessage");

if (tokenField) {
  tokenField.value = getToken();
}

saveBtn?.addEventListener("click", () => {
  const token = tokenField.value.trim();

  if (!token) {
    setMessage(message, "Paste a token first.", "error");
    return;
  }

  setToken(token);
  setMessage(message, "Token saved successfully.", "success");
});

clearBtn?.addEventListener("click", () => {
  clearToken();
  tokenField.value = "";
  setMessage(message, "Token cleared.", "success");
});
