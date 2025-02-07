"use strict";

// Получаем задачи из LocalStorage
function getTodos() {
  let todos = [];
  const todosStr = localStorage.getItem("todo");
  console.log("getTodos: Данные из localStorage:", todosStr);
  if (todosStr !== null) {
    try {
      todos = JSON.parse(todosStr);
      if (!Array.isArray(todos)) {
        console.error(
          "getTodos: Ошибка, данные в localStorage не являются массивом!",
          todos
        );
        return [];
      }
    } catch (e) {
      console.error("getTodos: Ошибка при парсинге JSON:", e);
      return [];
    }
  }
  console.log("getTodos: Возвращаю данные:", todos);
  return todos;
}

// Сохраняем задачи в LocalStorage
function saveTodos(todos) {
  localStorage.setItem("todo", JSON.stringify(todos));
}

// Добавление новой задачи
function addTodo() {
  const taskInput = document.getElementById("task");
  const task = taskInput.value.trim();

  if (task === "") {
    alert("Пожалуйста введите задачу!");
    return;
  }

  const todos = getTodos();
  todos.push(task);
  saveTodos(todos);

  showTodos();
  clearInput();
}

// Очистка поля ввода
function clearInput() {
  document.getElementById("task").value = "";
}

// Удаление задачи
function removeTodo(event) {
  const id = event.target.dataset.id;
  const todos = getTodos();
  todos.splice(id, 1);
  saveTodos(todos);

  showTodos();
}

// Редактирование задачи
function editTodo(event) {
  const id = event.target.dataset.id;
  const todos = getTodos(); // получаем список всех задач

  const listItem = event.target.parentElement.parentElement;
  const taskSpan = listItem.querySelector(".task-text");

  if (!taskSpan) {
    console.error("Элемент task-text, не найден");
    return;
  }

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = taskSpan.textContent;
  editInput.classList.add("edit-input");

  listItem.replaceChild(editInput, taskSpan);

  const saveButton = event.target;
  saveButton.textContent = "Сохранить";
  saveButton.classList.add("save");

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveTask(editInput, saveButton, id, listItem);
    }
  });

  saveButton.addEventListener("click", () => {
    saveTask(editInput, saveButton, id, listItem);
  });
}

// Сохранение отредактированной задачи
function saveTask(editInput, saveButton, id, listItem) {
  const todos = getTodos();
  const updatedTask = editInput.value.trim();

  if (updatedTask === "") {
    alert("Task cannot be empty!");
    return;
  }

  todos[id] = updatedTask;
  saveTodos(todos);

  if (listItem.contains(editInput)) {
    const taskSpan = document.createElement("span");
    taskSpan.textContent = updatedTask;
    taskSpan.classList.add("task-text");
    listItem.replaceChild(taskSpan, editInput);
  } else {
    console.error("Edit input not found in list item.");
  }

  if (listItem.contains(saveButton)) {
    saveButton.textContent = "Редактировать";
    saveButton.classList.remove("save");
  } else {
    console.error("Save button not found in list item.");
  }
}

// Отображение задач на странице
function showTodos() {
  const todos = getTodos();
  const todoList = document.getElementById("todos");

  todoList.innerHTML = "";

  if (!Array.isArray(todos)) {
    console.error("showTodos: getTodos не вернула массив");
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = todo;
    taskText.classList.add("task-text");

    const editButton = document.createElement("button");
    editButton.textContent = "Редактировать";
    editButton.classList.add("edit");
    editButton.dataset.id = index;
    editButton.addEventListener("click", editTodo);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.classList.add("remove");
    deleteButton.dataset.id = index;
    deleteButton.addEventListener("click", removeTodo);

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(buttonContainer);
    todoList.appendChild(li);
  });
}

// Событие для добавления задачи
document.getElementById("add").addEventListener("click", addTodo);

// Событие для добавления задачи при нажатии Enter
document.getElementById("task").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Изначальное отображение задач
showTodos();
