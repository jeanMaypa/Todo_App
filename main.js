// Initial page load
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    showTodoSection();
  } else {
    showRegistrationSection();
  }
});

// User Registration
function registerUser() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  if (!username || !password) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please enter both username and password",
      confirmButtonColor: "#4361ee",
    });
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: "Username already exists",
      confirmButtonColor: "#4361ee",
    });
    return;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  Swal.fire({
    icon: "success",
    title: "Registration Successful",
    text: "You can now login to your account",
    confirmButtonColor: "#4361ee",
  }).then(() => {
    showLoginSection();
  });
}

// User Login
function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", username);

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome back, ${username}!`,
      confirmButtonColor: "#4361ee",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      showTodoSection();
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid username or password",
      confirmButtonColor: "#4361ee",
    });
  }
}

// Logout
function logout() {
  Swal.fire({
    title: "Logout",
    text: "Are you sure you want to logout?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#4361ee",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, logout",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      showRegistrationSection();
    }
  });
}

// Todo List Functionality
function addTodo() {
  const todoInput = document.getElementById("todoInput");
  const todoText = todoInput.value.trim();

  if (!todoText) return;

  const currentUser = localStorage.getItem("currentUser");
  const todos = JSON.parse(
    localStorage.getItem(`todos_${currentUser}`) || "[]"
  );

  todos.push({
    id: Date.now(),
    text: todoText,
    completed: false,
  });

  localStorage.setItem(`todos_${currentUser}`, JSON.stringify(todos));
  todoInput.value = "";
  renderTodos();
}

function renderTodos() {
  const currentUser = localStorage.getItem("currentUser");
  const todoList = document.getElementById("todoList");
  const todos = JSON.parse(
    localStorage.getItem(`todos_${currentUser}`) || "[]"
  );

  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML =
      '<div class="empty-list"><i class="fas fa-clipboard-list" style="font-size: 2rem; margin-bottom: 10px;"></i><p>Your todo list is empty</p></div>';
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
                    <div class="todo-text">${todo.text}</div>
                    <div class="todo-actions">
                        <button class="edit-btn" onclick="editTodo(${todo.id})"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" onclick="deleteTodo(${todo.id})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
    todoList.appendChild(li);
  });
}

function editTodo(id) {
  const currentUser = localStorage.getItem("currentUser");
  const todos = JSON.parse(
    localStorage.getItem(`todos_${currentUser}`) || "[]"
  );
  const todo = todos.find((t) => t.id === id);

  if (!todo) return;

  const todoItem = event.target.closest(".todo-item");
  const oldContent = todoItem.innerHTML;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = todo.text;
  editInput.className = "edit-input";

  const saveButton = document.createElement("button");
  saveButton.innerHTML = '<i class="fas fa-save"></i>';
  saveButton.className = "edit-btn";
  saveButton.onclick = () => {
    const newText = editInput.value.trim();
    if (!newText) {
      Swal.fire({
        icon: "warning",
        title: "Task cannot be empty",
        confirmButtonColor: "#4361ee",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    todo.text = newText;
    localStorage.setItem(`todos_${currentUser}`, JSON.stringify(todos));
    renderTodos();

    Swal.fire({
      icon: "success",
      title: "Task Updated",
      confirmButtonColor: "#4361ee",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const cancelButton = document.createElement("button");
  cancelButton.innerHTML = '<i class="fas fa-times"></i>';
  cancelButton.className = "delete-btn";
  cancelButton.onclick = () => {
    todoItem.innerHTML = oldContent;
  };

  todoItem.innerHTML = "";
  const editForm = document.createElement("div");
  editForm.style.display = "flex";
  editForm.style.width = "100%";
  editForm.style.gap = "5px";

  editForm.appendChild(editInput);

  const buttonGroup = document.createElement("div");
  buttonGroup.style.display = "flex";
  buttonGroup.style.gap = "5px";

  buttonGroup.appendChild(saveButton);
  buttonGroup.appendChild(cancelButton);

  editForm.appendChild(buttonGroup);
  todoItem.appendChild(editForm);

  editInput.focus();
}

function deleteTodo(id) {
  const currentUser = localStorage.getItem("currentUser");

  Swal.fire({
    title: "Delete Task",
    text: "Are you sure you want to delete this task?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f44336",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const todos = JSON.parse(
        localStorage.getItem(`todos_${currentUser}`) || "[]"
      );
      const updatedTodos = todos.filter((todo) => todo.id !== id);

      localStorage.setItem(
        `todos_${currentUser}`,
        JSON.stringify(updatedTodos)
      );
      renderTodos();

      Swal.fire({
        icon: "success",
        title: "Task Deleted",
        confirmButtonColor: "#4361ee",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

// Section Visibility Functions
function showRegistrationSection() {
  document.getElementById("registrationSection").style.display = "block";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("todoSection").style.display = "none";
}

function showLoginSection() {
  document.getElementById("registrationSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("todoSection").style.display = "none";
}

function showTodoSection() {
  document.getElementById("registrationSection").style.display = "none";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("todoSection").style.display = "block";
  renderTodos();
}

// Add Enter key functionality
document
  .getElementById("regUsername")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      document.getElementById("regPassword").focus();
    }
  });

document
  .getElementById("regPassword")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      registerUser();
    }
  });

document
  .getElementById("loginUsername")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      document.getElementById("loginPassword").focus();
    }
  });

document
  .getElementById("loginPassword")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      loginUser();
    }
  });

document
  .getElementById("todoInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTodo();
    }
  });
