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


// HABITS
const habitForm = document.getElementById("habit-form");
const habitNameInput = document.getElementById("habit-name");
const habitGoalInput = document.getElementById("habit-goal");
const habitsList = document.getElementById("habits-list");
const weeklySummary = document.getElementById("weekly-summary");

let habits = JSON.parse(localStorage.getItem("habitsData")) || [];

// Get Saturday of current week
function getWeekStart() {
    const today = new Date();
    const day = today.getDay(); // 0 Sun - 6 Sat
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff)).toDateString();
}

// Reset if new week
function checkWeekReset() {
    const currentWeek = getWeekStart();
    habits.forEach(habit => {
        if (habit.weekStartDate !== currentWeek) {
            habit.progress = [false, false, false, false, false, false, false];
            habit.weekStartDate = currentWeek;
        }
    });
}
checkWeekReset();

function saveHabits() {
    localStorage.setItem("habitsData", JSON.stringify(habits));
}

// Add Habit
habitForm.addEventListener("submit", e => {
    e.preventDefault();

    const habit = {
        id: Date.now(),
        name: habitNameInput.value.trim(),
        goal: Number(habitGoalInput.value),
        progress: [false, false, false, false, false, false, false],
        weekStartDate: getWeekStart()
    };

    habits.push(habit);
    saveHabits();
    renderHabits();
    habitForm.reset();
});

// Render Habits
function renderHabits() {
    habitsList.innerHTML = "";
    let achieved = 0;

    habits.forEach(habit => {
        const doneCount = habit.progress.filter(v => v).length;
        if (doneCount >= habit.goal) achieved++;

        const card = document.createElement("div");
        card.className = "habit-card";

        const days = ["Sat","Sun","Mon","Tue","Wed","Thu","Fri"];

        card.innerHTML = `
            <h3>${habit.name}</h3>
            <p>${doneCount} / ${habit.goal}</p>
            <div class="days">
                ${days.map((d,i)=>`
                    <label>
                        <input type="checkbox" data-id="${habit.id}" data-day="${i}"
                        ${habit.progress[i] ? "checked":""}>
                        ${d}
                    </label>
                `).join("")}
            </div>
        `;

        habitsList.appendChild(card);
    });

    weeklySummary.innerText = `${achieved} / ${habits.length} goals achieved`;
}

// Toggle Day
habitsList.addEventListener("change", e => {
    if (!e.target.matches("input[type='checkbox']")) return;

    const id = Number(e.target.dataset.id);
    const day = Number(e.target.dataset.day);

    const habit = habits.find(h => h.id === id);
    habit.progress[day] = e.target.checked;

    saveHabits();
    renderHabits();
});

renderHabits();


//RESOURCES
const resourcesList = document.getElementById("resources-list");
const resourcesStatus = document.getElementById("resources-status");
const resourceSearch = document.getElementById("resource-search");
const resourceCategory = document.getElementById("resource-category");

let resources = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch Resources
async function loadResources() {
    resourcesStatus.innerText = "Loading...";

    try {
        const res = await fetch("./resources.json");
        if (!res.ok) throw new Error("Failed");

        resources = await res.json();
        resourcesStatus.innerText = "";
        fillCategories();
        renderResources();
    } catch {
        resourcesStatus.innerText = "Error loading resources.";
    }
}

function fillCategories() {
    const cats = [...new Set(resources.map(r => r.category))];
    cats.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.innerText = cat;
        resourceCategory.appendChild(opt);
    });
}

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderResources() {
    const search = resourceSearch.value.toLowerCase();
    const cat = resourceCategory.value;

    let filtered = resources.filter(r =>
        r.title.toLowerCase().includes(search)
    );

    if (cat !== "all") {
        filtered = filtered.filter(r => r.category === cat);
    }

    resourcesList.innerHTML = "";

    filtered.forEach(r => {
        const isFav = favorites.includes(r.id);

        const card = document.createElement("div");
        card.className = "resource-card";

        card.innerHTML = `
            <h3>${r.title}</h3>
            <p><strong>${r.category}</strong></p>
            <p>${r.description}</p>
            <a href="${r.link}" target="_blank">Visit</a>
            <span class="star ${isFav ? "fav" : ""}" data-id="${r.id}">
                ★
            </span>
        `;

        resourcesList.appendChild(card);
    });
}

// Favorite toggle
resourcesList.addEventListener("click", e => {
    if (!e.target.classList.contains("star")) return;

    const id = Number(e.target.dataset.id);

    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }

    saveFavorites();
    renderResources();
});

resourceSearch.addEventListener("input", renderResources);
resourceCategory.addEventListener("change", renderResources);

loadResources();