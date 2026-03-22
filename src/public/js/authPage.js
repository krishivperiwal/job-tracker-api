import { apiPost, setMessage, setToken } from "./apiClient.js";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("authMessage");

const handleAuth = async (form, endpoint, successText) => {
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await apiPost(endpoint, payload);

    if (data.token) {
      setToken(data.token);
    }

    setMessage(message, `${successText} Token saved. Redirecting to dashboard...`, "success");
    form.reset();
    
    // Redirect to dashboard after 1 second
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  } catch (error) {
    setMessage(message, error.message, "error");
  }
};

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleAuth(loginForm, "/auth/login", "Login successful.");
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handleAuth(registerForm, "/auth/register", "Registration successful.");
});
