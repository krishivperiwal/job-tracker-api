const API_BASE = "/api";

const tokenField = document.getElementById("tokenField");
const logBox = document.getElementById("logBox");

const totalApplications = document.getElementById("totalApplications");
const interviews = document.getElementById("interviews");
const offers = document.getElementById("offers");
const rejected = document.getElementById("rejected");
const ghosted = document.getElementById("ghosted");

const applicationsList = document.getElementById("applicationsList");
const interviewsList = document.getElementById("interviewsList");

const getToken = () => tokenField.value.trim();

const setToken = (token) => {
  tokenField.value = token;
  localStorage.setItem("jobTrackerToken", token);
};

const clearToken = () => {
  tokenField.value = "";
  localStorage.removeItem("jobTrackerToken");
};

const appendLog = (title, payload) => {
  const formatted = typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  const now = new Date().toLocaleTimeString();
  logBox.textContent = `[${now}] ${title}\n${formatted}\n\n${logBox.textContent}`;
};

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = data?.message || data || "Request failed";
    throw new Error(message);
  }

  return data;
};

const renderApplications = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    applicationsList.textContent = "No applications found.";
    return;
  }

  applicationsList.innerHTML = items
    .map(
      (item) => `
      <div class="list-item">
        <strong>${item.companyName}</strong> • ${item.role} • ${item.status}<br/>
        <span>ID: ${item._id}</span>
        ${item.resumeUrl ? `<br/><a href="${item.resumeUrl}" target="_blank" rel="noreferrer">View Resume</a>` : ""}
      </div>
    `
    )
    .join("");
};

const renderInterviews = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    interviewsList.textContent = "No interviews found.";
    return;
  }

  interviewsList.innerHTML = items
    .map(
      (item) => `
      <div class="list-item">
        <strong>${item.stageName}</strong> • ${item.result}<br/>
        <span>ID: ${item._id}</span>
      </div>
    `
    )
    .join("");
};

const loadAnalytics = async () => {
  try {
    const data = await request(`${API_BASE}/analytics`, {
      headers: {
        ...authHeaders()
      }
    });

    totalApplications.textContent = data.totalApplications || 0;
    interviews.textContent = data.interviews || 0;
    offers.textContent = data.offers || 0;
    rejected.textContent = data.rejected || 0;
    ghosted.textContent = data.ghosted || 0;

    appendLog("Analytics loaded", data);
  } catch (error) {
    appendLog("Analytics error", error.message);
  }
};

document.getElementById("saveTokenBtn").addEventListener("click", () => {
  const token = getToken();
  if (token) {
    localStorage.setItem("jobTrackerToken", token);
    appendLog("Token saved", "Token stored in localStorage.");
  }
});

document.getElementById("clearTokenBtn").addEventListener("click", () => {
  clearToken();
  appendLog("Token cleared", "Token removed from localStorage.");
});

document.getElementById("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (data.token) {
      setToken(data.token);
    }

    appendLog("Register success", data);
    event.target.reset();
    await loadAnalytics();
  } catch (error) {
    appendLog("Register error", error.message);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (data.token) {
      setToken(data.token);
    }

    appendLog("Login success", data);
    event.target.reset();
    await loadAnalytics();
  } catch (error) {
    appendLog("Login error", error.message);
  }
});

document.getElementById("refreshAnalyticsBtn").addEventListener("click", loadAnalytics);

document.getElementById("createApplicationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request(`${API_BASE}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    appendLog("Application created", data);
    event.target.reset();
    await Promise.all([loadAnalytics(), loadApplications()]);
  } catch (error) {
    appendLog("Create application error", error.message);
  }
});

const loadApplications = async () => {
  try {
    const data = await request(`${API_BASE}/applications`, {
      headers: {
        ...authHeaders()
      }
    });
    renderApplications(data);
    appendLog("Applications loaded", data);
  } catch (error) {
    appendLog("Load applications error", error.message);
  }
};

document.getElementById("loadApplicationsBtn").addEventListener("click", loadApplications);

document.getElementById("updateApplicationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");
  const status = formData.get("status");

  try {
    const data = await request(`${API_BASE}/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify({ status })
    });

    appendLog("Application updated", data);
    await Promise.all([loadAnalytics(), loadApplications()]);
  } catch (error) {
    appendLog("Update application error", error.message);
  }
});

document.getElementById("deleteApplicationForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");

  try {
    const data = await request(`${API_BASE}/applications/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeaders()
      }
    });

    appendLog("Application deleted", data);
    event.target.reset();
    await Promise.all([loadAnalytics(), loadApplications()]);
  } catch (error) {
    appendLog("Delete application error", error.message);
  }
});

document.getElementById("uploadResumeForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const id = formData.get("id");
  const payload = new FormData();
  payload.append("resume", formData.get("resume"));

  try {
    const data = await request(`${API_BASE}/applications/${id}/upload-resume`, {
      method: "POST",
      headers: {
        ...authHeaders()
      },
      body: payload
    });

    appendLog("Resume uploaded", data);
    await loadApplications();
  } catch (error) {
    appendLog("Upload resume error", error.message);
  }
});

document.getElementById("addInterviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const applicationId = formData.get("applicationId");

  const payload = {
    stageName: formData.get("stageName"),
    scheduledDate: formData.get("scheduledDate") || undefined,
    result: formData.get("result"),
    notes: formData.get("notes")
  };

  try {
    const data = await request(`${API_BASE}/applications/${applicationId}/interviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify(payload)
    });

    appendLog("Interview stage added", data);
    event.target.reset();
  } catch (error) {
    appendLog("Add interview error", error.message);
  }
});

document.getElementById("getInterviewsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const applicationId = formData.get("applicationId");

  try {
    const data = await request(`${API_BASE}/applications/${applicationId}/interviews`, {
      headers: {
        ...authHeaders()
      }
    });

    renderInterviews(data);
    appendLog("Interviews loaded", data);
  } catch (error) {
    appendLog("Get interviews error", error.message);
  }
});

document.getElementById("updateInterviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const interviewId = formData.get("interviewId");
  const result = formData.get("result");

  try {
    const data = await request(`${API_BASE}/interviews/${interviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders()
      },
      body: JSON.stringify({ result })
    });

    appendLog("Interview updated", data);
  } catch (error) {
    appendLog("Update interview error", error.message);
  }
});

document.getElementById("deleteInterviewForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const interviewId = formData.get("interviewId");

  try {
    const data = await request(`${API_BASE}/interviews/${interviewId}`, {
      method: "DELETE",
      headers: {
        ...authHeaders()
      }
    });

    appendLog("Interview deleted", data);
    event.target.reset();
  } catch (error) {
    appendLog("Delete interview error", error.message);
  }
});

const savedToken = localStorage.getItem("jobTrackerToken");
if (savedToken) {
  tokenField.value = savedToken;
  loadAnalytics();
}