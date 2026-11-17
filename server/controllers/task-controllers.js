const Task = require('../db/models/taskSchema');
const User = require('../db/models/userSchema');

module.exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({
        message: 'Assigned user not found',
      });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
    });
    return res.status(201).json({ message: 'task added succussfully' });
  } catch (error) {
    return res.status(500).json({ message: 'internal server error' });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the task
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    // Check permissions
    if (req.user.role === 'ADMIN') {
      // Admin can update any task
    } else if (req.user.role === 'MANAGER') {
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }
    } else if (req.user.role === 'USER') {
      if (task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    // Update task status
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: 'Task status updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (req.user.role === 'ADMIN') {
      // Admin can update any task
    } else if (req.user.role === 'MANAGER') {
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
      runValidators: true,
    });

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (req.user.role === 'ADMIN') {
      // Admin can update any task
    } else if (req.user.role === 'MANAGER') {
      if (task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }
    } else {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getTasks = async (req, res) => {
  try {
    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    // Filtering
    const { status, priority } = req.query;

    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    // Role-based conditions
    let roleFilter = {};

    if (req.user.role === 'ADMIN') {
      roleFilter = {};
    } else if (req.user.role === 'MANAGER') {
      roleFilter = { createdBy: req.user.id };
    } else if (req.user.role === 'USER') {
      roleFilter = { assignedTo: req.user.id };
    } else {
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    // Combine role and query filters
    const finalFilter = {
      ...roleFilter,
      ...filters,
    };

    // Get total matching tasks
    const totalTasks = await Task.countDocuments(finalFilter);

    // Calculate total pages
    const totalPages = Math.ceil(totalTasks / limit);

    // Get paginated tasks
    const tasks = await Task.find(finalFilter).skip(skip).limit(limit);

    return res.status(200).json({
      currentPage: page,
      totalPages,
      totalTasks,
      tasks,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
