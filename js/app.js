const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const completedCount = document.querySelector("#completed-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

function createTaskElement(task){

    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <span class = "task-text">${task.text}</span>

        <div class = "d-flex gap-2">

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

        filteredTasks = tasks.filter(function(task){
            return task.completed === false;
        });
    }

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

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks();

    updateTaskCount();

    taskInput.value = "";
    
});

taskList.addEventListener("click", function(event){

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

document.addEventListener("DOMContentLoaded", function(){

    const storedTasks = JSON.parse(localStorage.getItem("tasks"));

    if(storedTasks !== null){
        tasks = storedTasks;
    }

    tasks.forEach(function(task){
        createTaskElement(task);
    });

    updateTaskCount();
    updateCompletedCount();
});