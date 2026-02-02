import { tasks, tasksData } from "./state.js";

export const taskList = document.getElementById("task-list");
export const taskFilter = document.getElementById("task-filter");
export const taskSort = document.getElementById("task-sort");

export function renderTasks() {
    let filteredTasks = [...tasksData];

    // Filter
    const filterValue = taskFilter.value;
    if (filterValue === "active") filteredTasks = filteredTasks.filter(t => !t.completed);
    if (filterValue === "completed") filteredTasks = filteredTasks.filter(t => t.completed);

    // Sort
    const sortValue = taskSort.value;
    if (sortValue === "dueDate") {
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortValue === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    // Render
    taskList.innerHTML = "";
    filteredTasks.forEach(task => {
        const div = document.createElement("div");
        div.className = "task-card" + (task.completed ? " completed" : "");
        div.dataset.id = task.id;

        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ""}</p>
            <p>Due: ${task.dueDate} | Priority: ${task.priority} | Category: ${task.category || "-"}</p>
            <button class="complete-btn">${task.completed ? "Uncomplete" : "Complete"}</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        taskList.appendChild(div);
    });
}

// Dashboard Update
export function updateDashboard() {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

    const dueSoon = tasks.filter(task => {
        const due = new Date(task.dueDate);
        return due >= today && due <= twoDaysLater;
    });

    document.getElementById("tasks-due-soon").innerText = dueSoon.length;
    document.getElementById("tasks-completed").innerText = tasks.filter(t => t.completed).length;
    document.getElementById("habit-streak").innerText = 3; // placeholder

    const todayTasksList = document.getElementById("today-tasks");
    todayTasksList.innerHTML = "";
    dueSoon.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.title} (Due: ${task.dueDate})`;
        todayTasksList.appendChild(li);
    });

    const completed = tasks.filter(t => t.completed);
    const progress = tasks.length ? (completed.length / tasks.length) * 100 : 0;
    document.getElementById("progress").style.width = progress + "%";
}
