import { tasksData, editingTaskId } from "./state.js";
import { saveTasks } from "./storage.js";
import { renderTasks, updateDashboard, taskList, taskFilter, taskSort } from "./ui.js";

// NAVBAR
const navLinks = document.querySelectorAll(".nav-link");
const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-links");

navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        navMenu.classList.remove("show");
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';

        const targetId = this.getAttribute("href").slice(1);
        const targetSection = document.getElementById(targetId);

        const headerHeight = document.querySelector("header").offsetHeight;
        const sectionTop =
            targetSection.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
            top: sectionTop - headerHeight,
            behavior: "smooth"
        });
    });
});


menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuIcon.innerHTML = navMenu.classList.contains("show")
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
});

// DASHBOARD
updateDashboard();

// TASK FORM
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title-input");
const taskDescInput = document.getElementById("task-desc-input");
const taskDueInput = document.getElementById("task-due-input");
const taskPriorityInput = document.getElementById("task-priority-input");
const taskCategoryInput = document.getElementById("task-category-input");
const taskSubmitBtn = document.getElementById("task-submit-btn");
const taskCancelBtn = document.getElementById("task-cancel-btn");
const formError = document.getElementById("form-error");

// Add / Update Task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    formError.innerText = "";

    const title = taskTitleInput.value.trim();
    if (!title) return formError.innerText = "Title is required!";

    const taskObj = {
        id: editingTaskId || Date.now(),
        title,
        description: taskDescInput.value.trim(),
        dueDate: taskDueInput.value,
        priority: taskPriorityInput.value,
        category: taskCategoryInput.value.trim(),
        completed: false
    };

    if (editingTaskId) {
        const index = tasksData.findIndex(t => t.id === editingTaskId);
        tasksData[index] = { ...tasksData[index], ...taskObj };
        editingTaskId = null;
        taskSubmitBtn.innerText = "Add Task";
        taskCancelBtn.style.display = "none";
    } else {
        tasksData.push(taskObj);
    }

    taskForm.reset();
    saveTasks();
    renderTasks();
});

// Cancel Edit
taskCancelBtn.addEventListener("click", () => {
    editingTaskId = null;
    taskForm.reset();
    taskSubmitBtn.innerText = "Add Task";
    taskCancelBtn.style.display = "none";
    formError.innerText = "";
});

// Event Delegation
taskList.addEventListener("click", (e) => {
    const taskCard = e.target.closest(".task-card");
    if (!taskCard) return;
    const taskId = Number(taskCard.dataset.id);
    const taskIndex = tasksData.findIndex(t => t.id === taskId);
    const task = tasksData[taskIndex];

    if (e.target.classList.contains("complete-btn")) task.completed = !task.completed;
    else if (e.target.classList.contains("edit-btn")) {
        editingTaskId = task.id;
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description;
        taskDueInput.value = task.dueDate;
        taskPriorityInput.value = task.priority;
        taskCategoryInput.value = task.category;
        taskSubmitBtn.innerText = "Save Task";
        taskCancelBtn.style.display = "inline-block";
        return;
    } else if (e.target.classList.contains("delete-btn")) {
        if (confirm("Are you sure?")) tasksData.splice(taskIndex, 1);
        else return;
    }

    saveTasks();
    renderTasks();
});

// Filter & Sort
taskFilter.addEventListener("change", renderTasks);
taskSort.addEventListener("change", renderTasks);

// Initial Render
renderTasks();
