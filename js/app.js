const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");

let tasks = [];

function createTaskElement(task){

    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <span>${task.text}</span>

        <button class = "btn btn-danger btn-sm delete-btn">
            Delete
        </button>
    `;

    taskList.appendChild(li);
}

function updateTaskCount(){
    taskCount.textContent = tasks.length;
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

    createTaskElement(task);

    updateTaskCount();

    taskInput.value = "";
    
});

taskList.addEventListener("click", function(event){
    
    if(event.target.classList.contains("delete-btn")){

        const li = event.target.parentElement;

        const taskId = Number(li.getAttribute("data-id"));

        tasks = tasks.filter(function(task){
            return task.id !== taskId;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));

        li.remove();

        updateTaskCount();
    }
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

});