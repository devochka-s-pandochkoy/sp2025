document.getElementById('transactionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    fetch('http://localhost:3000/add-transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        alert('Транзакция добавлена');
        updateBalance();
    })
    .catch(error => console.error('Ошибка:', error));
});

function updateBalance() {
    fetch('http://localhost:3000/get-balance?user_id=1')
        .then(response => response.json())
        .then(data => {
            document.getElementById('balance').innerText = `Баланс: ${data.balance}`;
        });
}

updateBalance();