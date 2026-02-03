export let tasks = [
    { id: 1, title: "Math Homework", dueDate: "2026-02-04", priority: "High", completed: false },
    { id: 2, title: "Read Chapter 3", dueDate: "2026-02-05", priority: "Medium", completed: true },
    { id: 3, title: "Exercise", dueDate: "2026-02-06", priority: "Low", completed: false },
];

export let tasksData = JSON.parse(localStorage.getItem("tasksData")) || [];
export let editingTaskId = null;
