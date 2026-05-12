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

    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <span>${taskText}</span>
        <button class = "btn btn-danger btn-sm delete-btn">Delete</button>
    `;

    taskList.appendChild(li);

    taskInput.value = "";
    
});

taskList.addEventListener("click", function(event){
    
    if(event.target.classList.contains("delete-btn")){
        event.target.parentElement.remove();
    }
});