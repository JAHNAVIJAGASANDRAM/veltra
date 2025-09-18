// This file handles all task-related API routes.

import express from 'express';
const router = express.Router();

// A simple example route to get a list of tasks
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'List of all tasks',
    tasks: [
      { id: 1, title: 'Complete a task' },
      { id: 2, title: 'Finish the project' }
    ]
  });
});

// A simple example route to create a new task
router.post('/', (req, res) => {
  const newTask = req.body;
  res.status(201).json({
    message: 'Task successfully created',
    newTask: newTask
  });
});

export default router;
