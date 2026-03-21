import { apiGet, setMessage } from "./apiClient.js";

const message = document.getElementById("analyticsMessage");
const refreshBtn = document.getElementById("refreshAnalyticsBtn");

const fields = {
  totalApplications: document.getElementById("totalApplications"),
  interviews: document.getElementById("interviews"),
  offers: document.getElementById("offers"),
  rejected: document.getElementById("rejected"),
  ghosted: document.getElementById("ghosted")
};

const loadAnalytics = async () => {
  try {
    const data = await apiGet("/analytics");

    Object.entries(fields).forEach(([key, el]) => {
      if (el) {
        el.textContent = data[key] ?? 0;
      }
    });

    setMessage(message, "Analytics refreshed.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
};

refreshBtn?.addEventListener("click", loadAnalytics);
loadAnalytics();
