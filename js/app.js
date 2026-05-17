const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.querySelector("#search-input");
const submitButton = document.querySelector("#task-form button");
const taskPriorityInput = document.querySelector("#task-priority");
const sortSelect = document.querySelector("#sort-select");
const taskDeadlineInput = document.querySelector("#task-deadline");

let tasks = [];
let currentFilter = "all";
let searchTerm = "";
let editingTaskId = null;
let currentSort = "priority";

submitButton.textContent = "Add Task";

function getPriorityBadgeClass(priority){

    if(priority === "HIGH"){
        return "bg-danger";
    }

    if(priority === "MEDIUM"){
        return "bg-warning text-dark";
    }

    return "bg-secondary";

}

function getPriorityValue(priority){

    if(priority === "HIGH"){
        return 1;
    }

    if(priority === "MEDIUM"){
        return 2;
    }

    return 3;

}

function getDeadlineStatus(deadline){

    if(!deadline){
        return null;
    }

    const today = new Date();
    const deadlineDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    if(deadlineDate < today){
        return "overdue";
    }

    if(deadlineDate.getTime() === today.getTime()){
        return "today";
    }

    return "upcoming";

}

function getDeadlineBadgeClass(status){

    if(status === "overdue"){
        return "bg-danger";
    }

    if(status === "today"){
        return "bg-warning text-dark";
    }

    return "bg-info text-dark";

}


function createTaskElement(task){

    const li = document.createElement("li");

    const deadlineStatus = getDeadlineStatus(task.deadline);

    li.setAttribute("data-id", task.id);

    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
        <div class = "task-text align-items-center gap-3">

            <span class = "task-text"> ${task.text}</span>

            <span class = "badge ${getPriorityBadgeClass(task.priority)}">
                ${task.priority}
            </span>

            ${task.deadline ? `
                <span class = "badge ${getDeadlineBadgeClass(deadlineStatus)}">
                    ${deadlineStatus === "overdue" ? "Overdue": deadlineStatus === "today" ? "Due Today" : "Upcoming"}: ${task.deadline}
                </span>
                `: ""}
        

        </div>

        <div class = "d-flex gap-2">

            <button class = "btn btn-primary btn-sm edit-btn">
                Edit
            </button>

            <button class = "btn btn-success btn-sm complete-btn">
                Complete
            </button>

            <button class = "btn btn-danger btn-sm delete-btn">
                Delete
            </button>
        </div>
    `;

    taskList.appendChild(li);

    if(task.completed){
        const taskText = li.querySelector(".task-text");

        taskText.classList.add("completed");
    }
}

function renderTasks(){

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if(currentFilter === "completed"){

        filteredTasks = tasks.filter(function(task){
            return task.completed === true;
        });
    }

    if(currentFilter === "pending"){

        filteredTasks = filteredTasks.filter(function(task){
            return task.completed === false;
        });
    }

    if(currentFilter === "high"){

        filteredTasks = filteredTasks.filter(function(task){
            return task.priority === "HIGH";
        });
    }

    if(currentFilter === "medium"){

        filteredTasks = filteredTasks.filter(function(task){
            return task.priority === "MEDIUM";
        });
    }

    if(currentFilter === "low"){

        filteredTasks = filteredTasks.filter(function(task){
            return task.priority === "LOW";
        });
    }


    if(searchTerm !== ""){

        filteredTasks = filteredTasks.filter(function(task){
            return task.text.toLowerCase().includes(searchTerm);
        });
    }

    filteredTasks = [...filteredTasks].sort(function(a, b){

        if(currentSort === "priority"){
            return getPriorityValue(a.priority) - getPriorityValue(b.priority);
        }

        if(currentSort === "newest"){
            return b.id - a.id;
        }

        if(currentSort === "oldest"){
            return a.id - b.id;
        }

        if(currentSort === "deadline-nearest"){
            return new Date(a.deadline || "9999-12-31") - new Date(b.deadline || "9999-12-31");
        }

        if(currentSort === "deadline-farthest"){
             return new Date(b.deadline || "0000-01-01") - new Date(a.deadline || "0000-01-01");
        }
    });

    filteredTasks.forEach(function(task){
        createTaskElement(task);
    })
}

function updateTaskCount(){
    taskCount.textContent = tasks.length;
}

function updateCompletedCount(){
    const completedTasks = tasks.filter(function(task){
        return task.completed === true;
    });

    completedCount.textContent = completedTasks.length;
}

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value;

    if(taskText.trim() === ""){
        return;
    }

    if(editingTaskId !== null){
        tasks = tasks.map(function(task){
            
            if(task.id === editingTaskId){
                return{
                    ...task,
                    text: taskText,
                    priority : taskPriorityInput.value,
                    deadline: taskDeadlineInput.value
                };
            }

            return task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        renderTasks();

        taskInput.value = "";
        taskPriorityInput.value = "MEDIUM";
        taskDeadlineInput.value = "";

        editingTaskId = null;

        submitButton.textContent = "Add Task";

        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: taskPriorityInput.value,
        deadline: taskDeadlineInput.value
    };

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    updateTaskCount();

    taskInput.value = "";
    taskDeadlineInput.value = "";
    
});

taskList.addEventListener("click", function(event){

    if(event.target.classList.contains("edit-btn")){

            const li = event.target.closest("li");

            const taskId = Number(li.getAttribute("data-id"));

            const task = tasks.find(function(task){
                return task.id === taskId;
            });

            taskInput.value = task.text;
            taskPriorityInput.value = task.priority;
            taskDeadlineInput.value = task.deadline;

            editingTaskId = taskId;

            submitButton.textContent = "Update Task";

    }


    if(event.target.classList.contains("complete-btn")){
        
        const li = event.target.closest("li");
        const taskId = Number(li.getAttribute("data-id"));
        const taskText = li.querySelector(".task-text");

        tasks = tasks.map(function(task){
            
            if(task.id == taskId){
                return{
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();

        updateCompletedCount();
    }
    
    if(event.target.classList.contains("delete-btn")){

        const li = event.target.closest("li");

        const taskId = Number(li.getAttribute("data-id"));

        tasks = tasks.filter(function(task){
            return task.id !== taskId;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        li.remove();

        updateTaskCount();
        updateCompletedCount();
    }
});

filterButtons.forEach(function(button){

    button.addEventListener("click", function(){

        filterButtons.forEach(function(btn){
            btn.classList.remove("filter-active");
        });

        button.classList.add("filter-active");

        currentFilter = button.getAttribute("data-filter");

        renderTasks();
    });

});

searchInput.addEventListener("input", function(){
    
    searchTerm = searchInput.value.toLowerCase();

    renderTasks();

});

sortSelect.addEventListener("change", function(){

    currentSort = sortSelect.value;

    renderTasks();

});

document.addEventListener("DOMContentLoaded", function(){

    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if(storedTasks !== null){
       
        tasks = storedTasks.map(function(task){

            return{
                ...task,
                priority: task.priority || "LOW"
            };
        });

    }

    tasks.forEach(function(task){
        createTaskElement(task);
    });

    updateTaskCount();
    updateCompletedCount();
});

