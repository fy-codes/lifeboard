const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");


taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value;
    if(taskText.trim() === ""){
        return;
    }

    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = taskText;

    taskList.appendChild(li);

    taskInput.value = "";
    
});