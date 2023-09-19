const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController'); // Create the controller file.

// Define routes for creating, reading, updating, and deleting tasks.
router.post('/create', TaskController.createTask);
router.get('/list', TaskController.listTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
