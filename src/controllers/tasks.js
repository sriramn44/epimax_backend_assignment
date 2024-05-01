
const { db } = require('../db');

const getAllTasks = (req, res) => {
  db.all('SELECT * FROM tasks', (err, tasks) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(tasks);
  });
};

const getTaskById = (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  });
};

const createTask = (req, res) => {
  const { title, description, status, assignee_id } = req.body;
  db.run('INSERT INTO tasks (title, description, status, assignee_id) VALUES (?, ?, ?, ?)', [title, description, status, assignee_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
};

const updateTask = (req, res) => {
  const id = req.params.id;
  const { title, description, status, assignee_id } = req.body;
  db.run('UPDATE tasks SET title = ?, description = ?, status = ?, assignee_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, description, status, assignee_id, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Task ${id} updated successfully` });
  });
};

const deleteTask = (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: `Task ${id} deleted successfully` });
  });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
