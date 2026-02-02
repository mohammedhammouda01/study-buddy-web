const navLinks = document.querySelectorAll(".nav-link");
const menuIcon = document.querySelector(".menu-icon");
const navMenu = document.querySelector(".nav-links");

// active state
navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        navLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        navMenu.classList.remove("show");
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// toggle menu
menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    if (navMenu.classList.contains("show")) {
        menuIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    } else {
        menuIcon.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
});

// Sample task data
let tasks = [
    { id: 1, title: "Math Homework", dueDate: "2026-02-02", priority: "High", completed: false },
    { id: 2, title: "Read Chapter 3", dueDate: "2026-02-03", priority: "Medium", completed: true },
    { id: 3, title: "Exercise", dueDate: "2026-02-04", priority: "Low", completed: false },
];

// Function to update Dashboard
function updateDashboard() {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    // Tasks due soon
    const dueSoon = tasks.filter(task => {
        const due = new Date(task.dueDate);
        return due >= today && due <= twoDaysLater;
    });
    document.getElementById("tasks-due-soon").innerText = dueSoon.length;

    // Completed tasks
    const completed = tasks.filter(task => task.completed);
    document.getElementById("tasks-completed").innerText = completed.length;

    // Habit streak (random for beginner)
    document.getElementById("habit-streak").innerText = 3; // Placeholder

    // Today tasks
    const todayTasksList = document.getElementById("today-tasks");
    todayTasksList.innerHTML = "";
    dueSoon.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.title} (Due: ${task.dueDate})`;
        todayTasksList.appendChild(li);
    });

    // Progress Bar
    const progress = tasks.length ? (completed.length / tasks.length) * 100 : 0;
    document.getElementById("progress").style.width = progress + "%";
}

// Handle Add Task
document.getElementById("add-task-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const dueDate = document.getElementById("task-due").value;

    tasks.push({ id: tasks.length + 1, title, dueDate, priority: "Medium", completed: false });

    this.reset();
    updateDashboard();
});

updateDashboard();