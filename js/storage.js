import { tasksData } from "./state.js";

export function saveTasks() {
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}
