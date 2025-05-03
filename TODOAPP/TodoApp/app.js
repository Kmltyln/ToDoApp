"use strict";

const textDescription = document.getElementById('txt-task-decription');
const btnAddTask = document.getElementById('btn-add-task');
const filters = document.querySelectorAll('#filters span');
const btnClearAll = document.getElementById('btn-clear-all');
const taskList = document.getElementById('task-list');

//O sırada Yeni Kayıt modu ya da Düzeltme modunda olup olmadığımızı anlamamızı sağlayacak bir değişken
let isEditMode = false; //true ise Edit, false ise New
//O sırada güncellenmekte olan görevin Id bilgisini tutacak değişken
let editedTaskId;
//O sırada hangi filtreleme modunda olduğumuz bilgisini tutan değişken, default olarak tüm görevler
let filterMode = 'all';

let taskListArray = [];

//btnAddTask butonuna tıklandığında çalışacak fonksiyonun adı addTask olsun.
btnAddTask.addEventListener('click', addTask);

//clearAll butonuna tıklandığında çalışacak fonksiyonun adı clearAll
btnClearAll.addEventListener('click', clearAll);

function displayTasks(filter) {
    taskList.innerHTML = '';
    if (taskListArray.length == 0) {
        taskList.innerHTML = '<div class="alert alert-warning mb-0">Tanımlı görev bulunmamaktadır!</div>';
    } else {
        for (let i = 0; i < taskListArray.length; i++) {
            const task = taskListArray[i];
            if (filter === 'all' || task.status === filter) {
                const completed = task.status == 'completed' ? 'checked' : "";
                const taskLi = `
                <li id="${task.id}" class="task list-group-item">
                    <div class="form-check d-flex justify-content-between align-items-center">
                        <input onclick="updateStatus(this)" type="checkbox" id="${task.id}" class="form-check-input mt-0" ${completed}>
                        <div class="input-group ">
                            <input class="form-control fs-5 ${completed}" type="text" id="${task.id}" value="${task.taskDescription}" disabled>
                            <button onclick="editTask(this)" class="btn btn-warning" id="${task.id}">
                                <i class="fa-regular fa-pen-to-square text-success"></i>
                                
                            </button>
                            <button onclick="deleteTask(this)" class="btn btn-danger" id="${task.id}">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                        </div>
                    </div>
                </li>
                `;
                taskList.insertAdjacentHTML('beforeend', taskLi);
            }

        }
    }
}

function assingSpansEvents() {
    for (let i = 0; i < filters.length; i++) {
        const span = filters[i];
        span.addEventListener('click', function () {
            const activeSpan = document.querySelector('span.active');
            activeSpan.classList.remove('active');
            span.classList.add('active');
            filterMode = span.id;
            displayTasks(filterMode);
        });
    }
}

function addTask(event) {
    event.preventDefault();

    let value = textDescription.value.trim();
    if (value == '') {
        alert('Lütfen görev açıklamasını boş bırakmayınız!')
    } else {
        let newId = taskListArray.length == 0 ? 1 : taskListArray[taskListArray.length - 1].id + 1;
        taskListArray.push(
            { id: newId, taskDescription: value, status: 'pending' }
        );
        setTasksToLocalStorage();
        displayTasks(filterMode);
        textDescription.value = "";
        textDescription.focus();
    }
}

function clearAll() {
    let answer = confirm('Tüm kayıtlar silinecektir!');
    if (answer) {
        taskListArray.splice(0);
        setTasksToLocalStorage();
        displayTasks(filterMode);
    }
}

function deleteTask(element) {
    const deletedTaskId = element.id;
    let deletedTask = taskListArray.filter(function (task) {
        if (task.id == deletedTaskId) return true;
    });
    let desc = deletedTask[0].taskDescription;
    let answer = confirm(`${desc} görevi silinecektir'`);
    if (answer) {
        let index = taskListArray.indexOf(deletedTask[0]);
        taskListArray.splice(index, 1);
        setTasksToLocalStorage();
        displayTasks(filterMode);
    }
}

function editTask(element) {
    editedTaskId = element.id;
    let editedTask = element.previousElementSibling;
    if (!isEditMode) {
        editedTask.removeAttribute("disabled");
        editedTask.focus();
        element.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
        element.classList.remove('btn-warning');
        element.classList.add('btn-info')
        isEditMode = true;
    } else {
        editedTask.setAttribute("disabled", "disabled");
        element.innerHTML = '<i class="fa-regular fa-pen-to-square text-success"></i>';
        element.classList.remove('btn-info');
        element.classList.add('btn-warning');
        isEditMode = false;
        for (let i = 0; i < taskListArray.length; i++) {
            let task = taskListArray[i];
            if (task.id == editedTaskId) {
                console.log(editTask)
                task.taskDescription = editedTask.value.trim();
                break;
            }
        }
        setTasksToLocalStorage();
        displayTasks(filterMode);
        console.log(taskListArray)
    }



}

function updateStatus(element) {
    const newStatus = element.checked ? "completed" : "pending";
    for (let i = 0; i < taskListArray.length; i++) {
        let task = taskListArray[i];
        if (task.id == element.id) {
            task.status = newStatus;
            break;
        }
    }
    setTasksToLocalStorage();
    displayTasks(filterMode);
}

function setTasksToLocalStorage() {
    localStorage.setItem("Task-List", JSON.stringify(taskListArray));
}

function getTasksFromLocalStorage() {
    let taskListItem = localStorage.getItem("Task-List");
    if (taskListItem != null) {
        taskListArray = JSON.parse(taskListItem);
    }
}

assingSpansEvents();
getTasksFromLocalStorage();
displayTasks(filterMode);

