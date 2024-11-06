const todoList = document.getElementById("todo-list");
const taskForm = document.getElementById("taskForm");

let tasks = [];
const difficulties = {
    easy: 50,       // Distance the boulder moves for each difficulty
    medium: 100,
    hard: 150,
    veryHard: 200,
    extreme: 350,
};

// Show the task form when the header is clicked
document.getElementById("header").addEventListener("click", openTaskForm);

function openTaskForm() {
    taskForm.style.display = "block";
}

function closeTaskForm() {
    taskForm.style.display = "none";
}

// Submit the task from the form inputs
function submitTask() {
    const taskName = document.getElementById("taskName").value;
    const taskDifficulty = document.getElementById("taskDifficulty").value;

    if (taskName && difficulties[taskDifficulty]) {
        const task = {
            text: taskName,
            difficulty: taskDifficulty,
        };
        tasks.push(task);
        renderTasks();
        closeTaskForm();
    } else {
        alert("Please enter a valid task name and difficulty.");
    }
}

// Render tasks in the to-do list container
function renderTasks() {
    todoList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task");
        taskItem.innerText = `${task.text} - ${task.difficulty}`;

        // Mark task complete on click
        taskItem.addEventListener("click", () => completeTask(index));

        todoList.appendChild(taskItem);
    });
}

// Function to complete a task
function completeTask(index) {
    const task = tasks[index];
    const distance = difficulties[task.difficulty];
    tasks.splice(index, 1);
    renderTasks();

    // Trigger boulder movement
    moveBoulder(distance);
}
