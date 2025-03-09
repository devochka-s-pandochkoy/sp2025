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
    database: 'task_manager'
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

// Добавление задачи
app.post('/tasks', (req, res) => {
    const { title, description, due_date, user_id } = req.body;
    const query = 'INSERT INTO tasks (title, description, due_date, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, due_date, user_id], (err, result) => {
        if (err) throw err;
        res.send('Задача добавлена');
    });
});

// Получение задач пользователя
app.get('/tasks', (req, res) => {
    const { user_id } = req.query;
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    db.query(query, [user_id], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});