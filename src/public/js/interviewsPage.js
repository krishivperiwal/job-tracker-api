import { apiDelete, apiGet, apiPatch, apiPost, setMessage } from "./apiClient.js";

const addForm = document.getElementById("addInterviewForm");
const listForm = document.getElementById("listInterviewForm");
const updateForm = document.getElementById("updateInterviewForm");
const deleteForm = document.getElementById("deleteInterviewForm");
const message = document.getElementById("interviewsMessage");
const list = document.getElementById("interviewsList");

const renderList = (items) => {
  if (!items.length) {
    list.innerHTML = "<p class='empty'>No interview stages found.</p>";
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="list-card">
      <h3>${item.stageName}</h3>
      <p>${item.result}</p>
      <p class="meta">ID: ${item._id}</p>
    </article>
  `).join("");
};

addForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(addForm);
  const applicationId = formData.get("applicationId");

  const payload = {
    stageName: formData.get("stageName"),
    scheduledDate: formData.get("scheduledDate") || undefined,
    result: formData.get("result"),
    notes: formData.get("notes")
  };

  try {
    await apiPost(`/applications/${applicationId}/interviews`, payload);
    addForm.reset();
    setMessage(message, "Interview stage added.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

listForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const applicationId = new FormData(listForm).get("applicationId");

  try {
    const data = await apiGet(`/applications/${applicationId}/interviews`);
    renderList(data);
    setMessage(message, "Interview stages loaded.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

updateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(updateForm);
  const interviewId = formData.get("interviewId");
  const result = formData.get("result");

  try {
    await apiPatch(`/interviews/${interviewId}`, { result });
    setMessage(message, "Interview updated.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});

deleteForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const interviewId = new FormData(deleteForm).get("interviewId");

  try {
    await apiDelete(`/interviews/${interviewId}`);
    deleteForm.reset();
    setMessage(message, "Interview deleted.", "success");
  } catch (error) {
    setMessage(message, error.message, "error");
  }
});
