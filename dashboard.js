function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function updateDashboardTasks() {
    const taskList = document.getElementById("task-list");
    const numberText = document.getElementById("number");
    const progressBar = document.querySelector(".progress");

    let todos = getTodos();
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;

    taskList.innerHTML = "";

    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = "taskItem";

        const taskId = `todo-${index}`;
        li.innerHTML = `
            <div class="task ${todo.completed ? "completed" : ""}">
                <input type="checkbox" id="${taskId}" ${todo.completed ? "checked" : ""} />
                <label for="${taskId}" class="custom-checkbox">
                    <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </svg>
                </label>
                <label for="${taskId}" class="todo-text">${todo.text}</label>
            </div>
        `;

        const checkbox = li.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", () => {
            todos[index].completed = checkbox.checked;
            saveTodos(todos);
            updateDashboardTasks(); // refresh everything
        });

        taskList.appendChild(li);
    });

    numberText.textContent = `${completed} / ${total}`;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    progressBar.style.width = `${percent}%`;
}

window.onload = updateDashboardTasks;
