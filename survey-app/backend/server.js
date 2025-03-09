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
    database: 'survey_app'
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

// Отправка анкеты
app.post('/submit-survey', (req, res) => {
    const surveyData = req.body;
    const query = 'INSERT INTO surveys (user_id, data) VALUES (?, ?)';
    db.query(query, [surveyData.user_id, JSON.stringify(surveyData)], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Данные сохранены' });
    });
});

// Получение результатов анкетирования
app.get('/survey-results', (req, res) => {
    const query = 'SELECT * FROM surveys';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});