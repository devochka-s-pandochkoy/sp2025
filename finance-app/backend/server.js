const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'finance_app'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Подключение к базе данных успешно');
});

// Аутентификация пользователя
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0 && bcrypt.compareSync(password, result[0].password_hash)) {
            const token = jwt.sign({ id: result[0].id }, 'secret_key', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Неверные данные');
        }
    });
});

// Добавление транзакции
app.post('/add-transaction', (req, res) => {
    const { type, category, amount, date, user_id } = req.body;
    const query = 'INSERT INTO transactions (type, category, amount, date, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [type, category, amount, date, user_id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Транзакция добавлена' });
    });
});

// Получение баланса
app.get('/get-balance', (req, res) => {
    const { user_id } = req.query;
    const query = 'SELECT SUM(amount) AS balance FROM transactions WHERE user_id = ?';
    db.query(query, [user_id], (err, result) => {
        if (err) throw err;
        res.json({ balance: result[0].balance || 0 });
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});