const mysql = require('mysql');

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

module.exports = db;

