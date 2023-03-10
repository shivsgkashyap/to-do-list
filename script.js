var list = JSON.parse(localStorage.getItem("local-list")) || [];
var itemsElement = document.querySelector(".items");
var listItem = document.querySelector(".item");
var listFilter = "all";
var selectedTodoCounter = null;
var showFooter = document.querySelector(".toolbar");
var completeAll = document.querySelector(".complete-all");
var clearCompleted = document.querySelector(".clear-completed");
var allFilter = document.querySelector(".all-filter");
var activeFilter = document.querySelector(".active-filter");
var completedFilter = document.querySelector(".completed-fliter");

function load() {
  removeEventListenerToClass(".fa-regular", "click", onCheckClick);
  removeEventListenerToClass(".delete", "click", onDeleteClick);
  removeEventListenerToClass(".user-input", "dblclick", onUserInputDblClick);
  removeEventListenerToClass(".todo-input", "blur", onBlurInput);
  removeEventListenerToClass(".todo-input", "keyup", onInputEnterKeyup);

  var totalItems = "";
  for (var counter = 0; counter < list.length; counter++) {
    if (listFilter === list[counter]["completed"] || listFilter === "all") {
      var item = `
        <div class="item" data-counter="${counter}">
          <i class="fa-regular ${
            list[counter]["completed"] ? "fa-circle-check" : "fa-circle"
          }"></i>
          <div class="user-input">${
            counter === selectedTodoCounter
              ? '<input class="todo-input" />'
              : list[counter]["input"]
          }</div>
          <i class="fa-solid fa-trash delete"></i>
        </div>
      `;
      totalItems = totalItems + item;
    }
  }

  itemsElement.innerHTML = totalItems;

  if (list.length === 0) {
    showFooter.style.visibility = "hidden";
    completeAll.style.visibility = "hidden";
  } else {
    showFooter.style.visibility = "visible";
    completeAll.style.visibility = "visible";
  }

  var visibility = false;
  for (var counter = 0; counter < list.length; counter++) {
    if (list[counter]["completed"] === true) {
      visibility = true;
    }
  }

  if (visibility === true) {
    clearCompleted.style.visibility = "visible";
  } else if (visibility === false) {
    clearCompleted.style.visibility = "hidden";
  }

  var listCount = document.querySelector(".list-count");
  var itemCount = document.querySelector(".item-count");
  var listCounter = 0;
  for (var counter = 0; counter < list.length; counter++) {
    if (list[counter]["completed"] === false) {
      var listCounter = listCounter + 1;
    }
  }
  listCount.textContent = listCounter;

  if (listCounter === 0 || listCounter > 1) {
    itemCount.textContent = "items left";
  } else {
    itemCount.textContent = "item left";
  }

  var todoInput = document.querySelector(".todo-input");
  if (todoInput !== null) {
    todoInput.value = list[selectedTodoCounter]["input"];
    todoInput.focus();
  }

  addEventListenerToClass(".fa-regular", "click", onCheckClick);
  addEventListenerToClass(".delete", "click", onDeleteClick);
  addEventListenerToClass(".user-input", "dblclick", onUserInputDblClick);

  addEventListenerToClass(".todo-input", "blur", onBlurInput);

  addEventListenerToClass(".todo-input", "keyup", onInputEnterKeyup);
}

load();

function saveToLocalStorage() {
  localStorage.setItem("local-list", JSON.stringify(list));
}

function addEventListenerToClass(cls, event, fn) {
  const elements = document.querySelectorAll(cls);

  for (var counter = 0; counter < elements.length; counter++) {
    elements[counter].addEventListener(event, fn);
  }
}

function removeEventListenerToClass(cls, event, fn) {
  const elements = document.querySelectorAll(cls);

  for (var counter = 0; counter < elements.length; counter++) {
    elements[counter].removeEventListener(event, fn);
  }
}

var inputElement = document.querySelector("input");
inputElement.addEventListener("keyup", function (eventData) {
  if (eventData.code === "Enter") {
    list.push({ input: eventData.target.value, completed: false });
    console.log(list);
    load();
    eventData.target.value = "";
  }
  saveToLocalStorage();
});

function onCheckClick(eventData) {
  var listElement = eventData.target;
  var itemElement = listElement.closest(".item");
  var counter = itemElement.dataset.counter;
  var todo = list[counter];
  todo["completed"] = !todo["completed"];

  load();
  saveToLocalStorage();
}

function onDeleteClick(eventData) {
  var listElement = eventData.target;
  var itemElement = listElement.closest(".item");
  var counter = itemElement.dataset.counter;
  list.splice(counter, 1);

  load();
  saveToLocalStorage();
}

function onUserInputDblClick(eventData) {
  var element = eventData.target;

  var itemElement = element.closest(".item");
  var counter = itemElement.dataset.counter;

  selectedTodoCounter = parseInt(counter, 10);

  load();
  saveToLocalStorage();
}

completeAll.addEventListener("click", function (eventData) {
  var status = false;
  for (var counter = 0; counter < list.length; counter++) {
    if (list[counter]["completed"] === false) {
      status = true;
    }
  }

  for (counter = 0; counter < list.length; counter++) {
    list[counter]["completed"] = status;
  }
  load();
  saveToLocalStorage();
});

clearCompleted.addEventListener("click", function (eventData) {
  for (var counter = list.length - 1; counter >= 0; counter--) {
    if (list[counter]["completed"] === true) {
      list.splice(counter, 1);
    }
  }
  load();
  saveToLocalStorage();
});

allFilter.addEventListener("click", function (eventData) {
  listFilter = "all";
  load();
});

activeFilter.addEventListener("click", function (eventData) {
  listFilter = false;
  load();
});

completedFilter.addEventListener("click", function (eventData) {
  listFilter = true;
  load();
});

function onBlurInput(eventData) {
  selectedTodoCounter = null;
  var inputElement = eventData.target;
  var itemElement = inputElement.closest(".item");
  var counter = itemElement.dataset.counter;
  list[counter]["input"] = eventData.target.value;
  load();
  saveToLocalStorage();
}

function onInputEnterKeyup(eventData) {
  if (eventData.code === "Enter") {
    selectedTodoCounter = null;
    var inputElement = eventData.target;
    var itemElement = inputElement.closest(".item");
    var counter = itemElement.dataset.counter;
    list[counter]["input"] = eventData.target.value;
    load();
    saveToLocalStorage();
  }
}
