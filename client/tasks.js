var root = document.getElementById('task-list');
var form = document.getElementById('task-form');
var title = document.querySelector('input');

var task = {};

function loadTasks() {
  fetch('http://localhost:3000/tasks', {
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => response.json())
    .then((tasks) => {
      root.innerHTML = '';
      tasks.forEach((task) => {
        var element = document.createElement('li');
        element.innerHTML = `
          <span id="task_title_${task.id}" class="task-title ${task.done ? 'task-done' : ''}">${task.title}</span>
          <button id="done_button_${task.id}" onclick="toggleTaskDone('${task.id}', '${task.title}', ${task.done})">${task.done ? 'Not Done' : 'Done'}</button>
          <button onclick="deleteTask('${task.id}')">Delete</button>
          <button onclick="editTask('${task.id}')">Edit</button>
          <div class="edit-form" id="edit_form_${task.id}">
            <input type="text" id="edit_title_${task.id}" value="${task.title}" />
            <button type="button" onclick="saveTask('${task.id}')">Save</button>
          </div>
        `;
        root.appendChild(element);
      });
    })
    .catch((error) => {
      console.error('Error loading tasks:', error);
    });
}

var taskForm = document.getElementById('task');
var titleInput = taskForm.querySelector('input[type="text"]');

taskForm.onsubmit = function (evt) {
  evt.preventDefault();
  task = {
    title: titleInput.value,
    done: false,
  };
  createTask(task);
};

function createTask(task) {
  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(task),
  })
    .then((response) => response.json())
    .then((task) => {
      console.log(`Task created successfully - Title: ${task.title}, Done: ${task.done}`);
      loadTasks();
    })
    .catch((error) => {
      console.error('Error adding task:', error);
    })
    .finally(() => {
      title.value = '';
    });
}

window.onload = loadTasks;

function editTask(taskId) {
  var editForm = document.getElementById(`edit_form_${taskId}`);
  var taskTitle = document.getElementById(`task_title_${taskId}`);

  editForm.style.display = 'block';
  taskTitle.style.display = 'none';
}

function saveTask(taskId) {
  var editForm = document.getElementById(`edit_form_${taskId}`);
  var editTitle = document.getElementById(`edit_title_${taskId}`);

  var updatedTask = {
    title: editTitle.value,
  };

  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(updatedTask),
  })
    .then((response) => {
      if (response.ok) {
        var taskTitleElement = document.getElementById(`task_title_${taskId}`);

        taskTitleElement.textContent = updatedTask.title;

        editForm.style.display = 'none';
        taskTitleElement.style.display = 'inline';
      } else {
        throw new Error('Failed to save task');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function toggleTaskDone(taskId, taskTitle, taskDone) {
  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ title: taskTitle, done: !taskDone }), // Inverte o estado "done"
  })
    .then((response) => {
      if (response.ok) {
        const taskTitleElement = document.getElementById(
          `task_title_${taskId}`,
        );
        const taskDoneButton = document.getElementById(
          `done_button_${taskId}`,
        );

        // Atualiza a aparência com base no novo estado "done"
        if (!taskDone) {
          taskTitleElement.classList.add('task-done');
          taskDoneButton.textContent = 'Not Done';
        } else {
          taskTitleElement.classList.remove('task-done');
          taskDoneButton.textContent = 'Done';
        }

        console.log(`Task updated - Title: ${taskTitle}, Done: ${!taskDone}`);
        loadTasks();
      } else {
        throw new Error('Failed to toggle task done status');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function deleteTask(taskId) {
  console.log('Deleting task with ID:', taskId);
  fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        var taskElement = document.getElementById(`task_title_${taskId}`);
        if (taskElement) {
          taskElement.parentElement.remove();
        } else {
          console.error('Task element not found');
        }
      } else {
        throw new Error('Failed to delete task');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

fetch('http://localhost:3000/tasks', {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})
  .then(function (response) {
    return response.json();
  })
  .then(function (tasks) {
    tasks.forEach(function (task) {
      var element = document.createElement('li');
      element.innerHTML = task.title;
      root.appendChild(element);
    });
  });
