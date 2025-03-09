document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, due_date: dueDate, user_id: 1 }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadTasks();
    })
    .catch(error => console.error('Ошибка:', error));
});

function loadTasks() {
    fetch('http://localhost:3000/tasks?user_id=1')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Срок выполнения: ${new Date(task.due_date).toLocaleString()}</p>
                `;
                taskList.appendChild(taskElement);
            });
        });
}

loadTasks();