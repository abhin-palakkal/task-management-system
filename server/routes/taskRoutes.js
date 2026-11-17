const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/task-controllers');
const checkToken = require('../middleware/checkToken');

const router = express.Router();

router.post('/create', checkToken(['ADMIN', 'MANAGER']), createTask);
router.get('/all', checkToken(['ADMIN', 'MANAGER', 'USER']), getTasks);
router.patch('/:id', checkToken(['ADMIN', 'MANAGER']), updateTask);
router.delete('/:id', checkToken(['ADMIN', 'MANAGER']), deleteTask);
router.patch(
  '/:id/status',
  checkToken(['ADMIN', 'MANAGER', 'USER']),
  updateTaskStatus
);

module.exports = router;
