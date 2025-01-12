var helloUser = document.getElementById("helloUser");
var toDoInput = document.getElementById("toDo");
var toDoList = document.querySelectorAll(".toDoList");
var btnAddUpdate = document.querySelectorAll(".btnAddUpdate");
var boxsList = document.querySelectorAll(".boxList");
var searchInput = document.getElementById("searchInput");
var myAcc = localStorage.getItem("userName");
var tasks = [];
var tasksDoing = [];
var uIndex;
var drag = null;
var modal = new bootstrap.Modal(document.getElementById("addAssignmentModal"));
document
  .querySelector(".btn-outline-dark")
  .addEventListener("click", function () {
    modal.show();
  });
helloUser.innerHTML = `Hello Employees
  , You can now write down your daily Assignment`;

if (localStorage.getItem("myTasks") == null) {
  tasks = [];
} else {
  tasks = JSON.parse(localStorage.getItem("myTasks"));
  displaytask(tasks);
}

//   This function is called when the user adds a new task.

function addToDO() {
  const taskName = document.getElementById("taskName");
  const dueDate = document.getElementById("dueDate");
  const priority = document.getElementById("priority");

  taskName.classList.remove("invalid-input");
  dueDate.classList.remove("invalid-input");
  priority.classList.remove("invalid-input");

  let valid = true;

  if (taskName.value === "") {
    taskName.classList.add("invalid-input");
    valid = false;
  }
  if (dueDate.value === "") {
    dueDate.classList.add("invalid-input");
    valid = false;
  }
  if (priority.value === "") {
    priority.classList.add("invalid-input");
    valid = false;
  }

  if (!valid) {
    alert("Please fill in all required fields.");
    return;
  }

  var myTasks = {
    task: taskName.value,
    dueDate: dueDate.value,
    priority: priority.value,
  };
  tasks.push(myTasks);
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  clearToDoForm();
  displaytask(tasks);
  dragItem();
  modal.hide();
}
//   Clears the form fields after a task is added or updated.
function clearToDoForm() {
  document.getElementById("taskName").value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "Low";
}
//  This function displays the tasks on the screen after they are loaded.

function displaytask(arr) {
  arr.sort((a, b) => {
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  let box = "";
  for (let i = 0; i < arr.length; i++) {
    box += `
      <div class="toDoList mt-4">
        <div draggable="true" class="my-2">
          <div class="w-100 fs-5 fw-medium text-light">
            <div class="item d-flex justify-content-between align-items-center rounded-2 p-3">
              <div>
                <div>${arr[i].task}</div>
                <div><small>Due: ${arr[i].dueDate}</small></div>
                <div><small>Priority: ${arr[i].priority}</small></div>
              </div>
              <div class="icons">
                <a onclick="setFormForUpdate(${i})" href="#"><i class="fa-solid fa-pen-to-square fw-lighter text-success"></i></a>
                <a onclick="deleteTask(${i})" href="#"><i class="fa-solid fa-trash-can fw-lighter text-danger"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
  toDoList[0].innerHTML = box;
}

//  This function filters tasks based on the search input value.
searchInput.addEventListener("input", filterTasks);
function filterTasks() {
  var query = searchInput.value.toLowerCase();

  var filteredTasks = tasks.filter((task) => {
    return (
      task.task.toLowerCase().includes(query) ||
      task.dueDate.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query)
    );
  });
  displaytask(filteredTasks);
}
//  This function deletes a task .

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("myTasks", JSON.stringify(tasks));
  displaytask(tasks);
}

//  This function sets the form values for updating an existing task.

function setFormForUpdate(index) {
  uIndex = index;
  const task = tasks[index];

  document.getElementById("taskName").value = task.task;
  document.getElementById("dueDate").value = task.dueDate;
  document.getElementById("priority").value = task.priority;

  modal.show();

  btnAddUpdate[0].classList.replace("d-block", "d-none");
  btnAddUpdate[1].classList.replace("d-none", "d-block");
}

function updateTask() {
  tasks[uIndex].task = document.getElementById("taskName").value;
  tasks[uIndex].dueDate = document.getElementById("dueDate").value;
  tasks[uIndex].priority = document.getElementById("priority").value;

  localStorage.setItem("myTasks", JSON.stringify(tasks));

  btnAddUpdate[1].classList.replace("d-block", "d-none");
  btnAddUpdate[0].classList.replace("d-none", "d-block");

  displaytask(tasks);
  clearToDoForm();
  modal.hide();
}
//  This function enables drag-and-drop functionality for the tasks.
function dragItem() {
  var items = document.querySelectorAll(".toDoList div");
  items.forEach((item) => {
    item.addEventListener("dragstart", function () {
      drag = item;
      item.classList.add("opacity-50");
    });

    item.addEventListener("dragend", function () {
      drag = null;
      item.classList.remove("opacity-50");
    });
  });

  boxsList.forEach((boxList) => {
    boxList.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("bg-success", "text-light", "opacity-75");
    });
    boxList.addEventListener("dragleave", function () {
      this.classList.remove("bg-success", "text-light", "opacity-75");
    });

    boxList.addEventListener("drop", function () {
      if (drag) {
        this.append(drag);
        this.classList.remove("bg-success", "text-light", "opacity-75");
      }
    });
  });
}
dragItem();
