const express = require('express');
const bodyParser = require('body-parser');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(bodyParser.json());
app.use('/tasks', tasksRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
