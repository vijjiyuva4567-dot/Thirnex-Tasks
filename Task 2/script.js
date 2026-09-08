
/* =========================================
   TODO LIST APPLICATION
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");

const filterButtons = document.querySelectorAll(".filter-btn");

const clearCompletedButton =
    document.getElementById("clear-completed");

const emptyMessage =
    document.getElementById("empty-message");


/* =========================================
   APPLICATION STATE
========================================= */

let tasks = JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";


/* =========================================
   INITIALIZE APPLICATION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    renderTasks();

});


/* =========================================
   CREATE TASK
========================================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();


    // Do not add empty task
    if (taskText === "") {

        alert("Please enter a task.");

        return;
    }


    // Create new task object
    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to state
    tasks.push(newTask);


    // Save data
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Render updated tasks
    renderTasks();


    // Put cursor back into input
    taskInput.focus();

});


/* =========================================
   SAVE TASKS TO LOCAL STORAGE
========================================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


/* =========================================
   RENDER TASKS
========================================= */

function renderTasks() {

    // Clear existing DOM elements
    taskList.innerHTML = "";


    // Filter tasks
    const filteredTasks = getFilteredTasks();


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create task elements
    filteredTasks.forEach(function (task) {

        const taskElement = createTaskElement(task);

        taskList.appendChild(taskElement);

    });


    // Update counter
    updateTaskCount();

}


/* =========================================
   GET FILTERED TASKS
========================================= */

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(function (task) {

            return !task.completed;

        });

    }


    if (currentFilter === "completed") {

        return tasks.filter(function (task) {

            return task.completed;

        });

    }


    return tasks;

}


/* =========================================
   CREATE TASK DOM ELEMENT
========================================= */

function createTaskElement(task) {

    // Create list item
    const li = document.createElement("li");

    li.classList.add("task-item");


    // Add completed class
    if (task.completed) {

        li.classList.add("completed");

    }


    // Store task ID in DOM
    li.dataset.id = task.id;


    /* =====================================
       CHECKBOX
    ===================================== */

    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.classList.add("task-checkbox");

    checkbox.checked = task.completed;


    /* =====================================
       TASK TEXT
    ===================================== */

    const span = document.createElement("span");

    span.classList.add("task-text");

    span.textContent = task.text;


    /* =====================================
       ACTION BUTTON CONTAINER
    ===================================== */

    const actions = document.createElement("div");

    actions.classList.add("task-actions");


    /* =====================================
       EDIT BUTTON
    ===================================== */

    const editButton = document.createElement("button");

    editButton.classList.add("edit-btn");

    editButton.dataset.action = "edit";

    editButton.textContent = "Edit";


    /* =====================================
       DELETE BUTTON
    ===================================== */

    const deleteButton = document.createElement("button");

    deleteButton.classList.add("delete-btn");

    deleteButton.dataset.action = "delete";

    deleteButton.textContent = "Delete";


    /* =====================================
       BUILD ELEMENT
    ===================================== */

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);

    li.appendChild(checkbox);

    li.appendChild(span);

    li.appendChild(actions);


    return li;

}


/* =========================================
   EVENT DELEGATION
========================================= */

taskList.addEventListener("click", function (event) {

    const button = event.target.closest("button");

    const taskItem = event.target.closest(".task-item");


    // If click was not inside a task
    if (!taskItem) {

        return;

    }


    const taskId = Number(taskItem.dataset.id);


    /* =====================================
       EDIT / DELETE BUTTON
    ===================================== */

    if (button) {

        const action = button.dataset.action;


        if (action === "edit") {

            editTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }

    }

});


/* =========================================
   CHECKBOX EVENT DELEGATION
========================================= */

taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-checkbox")) {

        return;

    }


    const taskItem =
        event.target.closest(".task-item");


    const taskId =
        Number(taskItem.dataset.id);


    toggleTask(taskId);

});


/* =========================================
   TOGGLE TASK COMPLETION
========================================= */

function toggleTask(taskId) {

    tasks = tasks.map(function (task) {

        if (task.id === taskId) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

}


/* =========================================
   DELETE TASK
========================================= */

function deleteTask(taskId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");


    if (!confirmDelete) {

        return;

    }


    tasks = tasks.filter(function (task) {

        return task.id !== taskId;

    });


    saveTasks();

    renderTasks();

}


/* =========================================
   EDIT TASK
========================================= */

function editTask(taskId) {

    const task =
        tasks.find(function (task) {

            return task.id === taskId;

        });


    if (!task) {

        return;

    }


    const taskItem =
        document.querySelector(
            `.task-item[data-id="${taskId}"]`
        );


    if (!taskItem) {

        return;

    }


    const taskText =
        taskItem.querySelector(".task-text");


    const actions =
        taskItem.querySelector(".task-actions");


    // Create input
    const editInput =
        document.createElement("input");


    editInput.type = "text";

    editInput.classList.add("edit-input");

    editInput.value = task.text;


    // Replace text with input
    taskText.replaceWith(editInput);


    // Change buttons
    actions.innerHTML = "";


    const saveButton =
        document.createElement("button");


    saveButton.classList.add("edit-btn");

    saveButton.dataset.action = "save";

    saveButton.textContent = "Save";


    const cancelButton =
        document.createElement("button");


    cancelButton.classList.add("delete-btn");

    cancelButton.dataset.action = "cancel";

    cancelButton.textContent = "Cancel";


    actions.appendChild(saveButton);

    actions.appendChild(cancelButton);


    // Focus input
    editInput.focus();


    /* =====================================
       SAVE EDIT
    ===================================== */

    saveButton.addEventListener("click", function () {

        const newText =
            editInput.value.trim();


        if (newText === "") {

            alert("Task cannot be empty.");

            return;

        }


        tasks = tasks.map(function (task) {

            if (task.id === taskId) {

                return {
                    ...task,
                    text: newText
                };

            }

            return task;

        });


        saveTasks();

        renderTasks();

    });


    /* =====================================
       CANCEL EDIT
    ===================================== */

    cancelButton.addEventListener("click", function () {

        renderTasks();

    });


    /* =====================================
       ENTER KEY TO SAVE
    ===================================== */

    editInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            saveButton.click();

        }


        if (event.key === "Escape") {

            renderTasks();

        }

    });

}


/* =========================================
   FILTER TASKS
========================================= */

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class
        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add active class
        button.classList.add("active");


        // Change current filter
        currentFilter =
            button.dataset.filter;


        // Render filtered tasks
        renderTasks();

    });

});


/* =========================================
   CLEAR COMPLETED TASKS
========================================= */

clearCompletedButton.addEventListener(
    "click",
    function () {

        const completedTasks =
            tasks.filter(function (task) {

                return task.completed;

            });


        if (completedTasks.length === 0) {

            alert("There are no completed tasks.");

            return;

        }


        const confirmClear =
            confirm(
                "Are you sure you want to clear all completed tasks?"
            );


        if (!confirmClear) {

            return;

        }


        tasks = tasks.filter(function (task) {

            return !task.completed;

        });


        saveTasks();

        renderTasks();

    }
);


/* =========================================
   UPDATE TASK COUNT
========================================= */

function updateTaskCount() {

    const activeTasks =
        tasks.filter(function (task) {

            return !task.completed;

        });


    const count = activeTasks.length;


    if (count === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${count} tasks remaining`;

    }

}

