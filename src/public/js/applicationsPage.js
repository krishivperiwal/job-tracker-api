import { apiDelete, apiGet, apiPatch, apiPost, setMessage } from "./apiClient.js";

const createForm = document.getElementById("createApplicationForm");
const updateForm = document.getElementById("updateApplicationForm");
const deleteForm = document.getElementById("deleteApplicationForm");
const uploadForm = document.getElementById("uploadResumeForm");
const loadBtn = document.getElementById("loadApplicationsBtn");
const message = document.getElementById("applicationsMessage");
const list = document.getElementById("applicationsList");

const renderList = (items) => {
  if (!items.length) {
    list.innerHTML = "<p class='empty'>No applications found.</p>";
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="list-card">
      <h3>${item.companyName}</h3>
      <p>${item.role} • ${item.status}</p>
      <p class="meta">ID: ${item._id}</p>
      ${item.resumeUrl ? `<a href="${item.resumeUrl}" target="_blank" rel="noreferrer">View Resume</a>` : ""}
    </article>
  `).join("");
};

const loadApplications = async () => {
  try {
    const data = await apiGet("/applications");
    renderList(data);
    setMessage(message, "Applications loaded.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
};

createForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(createForm).entries());

  try {
    await apiPost("/applications", payload);
    createForm.reset();
    setMessage(message, "Application created.", "success");
    await loadApplications();
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

updateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(updateForm);
  const id = formData.get("id");
  const status = formData.get("status");

  try {
    await apiPatch(`/applications/${id}`, { status });
    setMessage(message, "Application status updated.", "success");
    await loadApplications();
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

deleteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = new FormData(deleteForm).get("id");

  try {
    await apiDelete(`/applications/${id}`);
    deleteForm.reset();
    setMessage(message, "Application deleted.", "success");
    await loadApplications();
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(uploadForm);
  const id = formData.get("id");
  const payload = new FormData();
  payload.append("resume", formData.get("resume"));

  try {
    await apiPost(`/applications/${id}/upload-resume`, payload);
    uploadForm.reset();
    setMessage(message, "Resume uploaded.", "success");
    await loadApplications();
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

loadBtn?.addEventListener("click", loadApplications);
loadApplications();
