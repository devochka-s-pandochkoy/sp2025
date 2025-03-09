document.getElementById('adminForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const question = document.getElementById('question').value;

    fetch('http://localhost:3000/add-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
    })
    .then(response => response.json())
    .then(result => {
        alert('Вопрос добавлен');
    })
    .catch(error => console.error('Ошибка:', error));
});

