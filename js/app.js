// File: js/app.js
// Student: Majed Hanini (12428205)
// This file implements loading, adding, and deleting tasks using the Fetch API.

/* 
  Configuration values used by the API.
  STUDENT_ID and API_KEY must not be changed.
*/

// ---------------- CONFIGURATION ----------------
const STUDENT_ID = "12428205";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

/* 
  DOM elements used to handle form input, display status messages,
  and render the list of tasks dynamically.
*/


// ---------------- DOM ELEMENTS ----------------
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/*
  Updates the status message area.
  isError=true applies an error color for failed operations.
*/


// ---------------- STATUS MESSAGE ----------------
function setStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? "#d9363e" : "#666";
}

/*
  Updates the status message area.
  isError=true applies an error color for failed operations.
*/

/*
  Loads all tasks from the server when the page is opened.
  Fetches data from get.php, converts JSON, and renders each task.
*/


// ---------------- LOAD TASKS ON PAGE LOAD ----------------
document.addEventListener("DOMContentLoaded", async () => {
  setStatus("Loading tasks...");

  try {
    const res = await fetch(
      `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`
    );

    const data = await res.json();

    if (data.success && Array.isArray(data.tasks)) {
      list.innerHTML = "";
      data.tasks.forEach(task => renderTask(task));
      setStatus("");
    } else {
      setStatus("No tasks found.");
    }

  } catch (error) {
    setStatus("Failed to load tasks.", true);
  }
});

/*
  Handles form submission to add a new task.
  Sends a POST request with JSON body to add.php.
  If successful, the new task is rendered immediately into the list.
*/


// ---------------- ADD NEW TASK ----------------
form.addEventListener("submit", async event => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) {
    setStatus("Task cannot be empty!", true);
    return;
  }

  setStatus("Adding task...");

  try {
    const res = await fetch(
      `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      }
    );

    const data = await res.json();

    if (data.success && data.task) {
      renderTask(data.task);
      input.value = "";
      setStatus("Task added successfully.");
    } else {
      setStatus("Could not add task!", true);
    }

  } catch (error) {
    setStatus("Network error while adding task.", true);
  }
});

/*
  Renders a single task into the list as an <li> element.
  Also attaches a delete button that removes the task using the API.
*/


// ---------------- RENDER A SINGLE TASK ----------------
function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.textContent = task.title;

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.className = "delete-btn";

    // Sends a delete request for this task and removes it from DOM on success.

  // DELETE TASK
  delBtn.addEventListener("click", async () => {
    setStatus("Deleting task...");

    try {
      const res = await fetch(
        `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${task.id}`
      );

      const data = await res.json();

      if (data.success) {
        li.remove();
        setStatus("Task deleted.");
      } else {
        setStatus("Failed to delete task!", true);
      }

    } catch (error) {
      setStatus("Network error while deleting task.", true);
    }
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}
