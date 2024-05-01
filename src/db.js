
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', err => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the database.');
  }
});

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      status TEXT,
      assignee_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(assignee_id) REFERENCES users(id)
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password_hash TEXT
    )
  `);
};
createTables();


module.exports = { db };
