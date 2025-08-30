

import Task from '../model/taskModel.js';

class TaskController {
    async createTask(req, res) {
        try {
            const { title, description , status, dueDate, assignedTo } = req.body;

            const task = new Task({
                title,
                description,
                status,
                dueDate,
                assignedTo,
                projectId: req.params.projectId
            });

            await task.save();
            res.status(201).json({ message: "Task created", task });
        } catch (error) {
            res.status(500).json({ message: "Error creating task", error: error.message });
        }
    };

    async getTasksByProject(req, res) {
        try {
            const tasks = await Task.find({ projectId: req.params.projectId })
                .populate("assignedTo", "name email image")
                .populate("projectId", "name")
                .sort({ createdAt: -1 });

            res.json({sataus: true, message: "Tasks fetched", data: tasks});
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error: error.message });
        }
    };
    
    async getTasksCountAdmin (req, res) {
        try {
            if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized to get tasks count" });

            const tasks = await Task.find().countDocuments();
            res.json({ message: "Tasks count fetched", tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks count", error: error.message });
        }
    }

    async getTaskProgress(req, res) {
        try {
            const tasks = await Task.find({ projectId: req.params.projectId }).countDocuments();
            const completedTasks = await Task.find({ projectId: req.params.projectId, status: "Completed" }).countDocuments();
            const progress = (completedTasks / tasks) * 100;
            const totalTasks = tasks - completedTasks;
            res.json({ message: "Task progress fetched", progress , totalTasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching task progress", error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await Task.findById(req.params.id).populate("assignedTo", "name email");
            if (!task) return res.status(404).json({ message: "Task not found" });

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: "Error fetching task", error: error.message });
        }
    };

    async updateTask(req, res) {
        try {
            const { title, description, dueDate, status, assignedTo } = req.body;

            const task = await Task.findById(req.params.id);
            if (!task) return res.status(404).json({ message: "Task not found" });

            task.title = title || task.title;
            task.description = description || task.description;
            task.dueDate = dueDate || task.dueDate;
            task.status = status || task.status;
            task.assignedTo = assignedTo || task.assignedTo;

            await task.save();
            res.json({ message: "Task updated", task });
        } catch (error) {
            res.status(500).json({ message: "Error updating task", error: error.message });
        }
    };

    async deleteTask(req, res) {
        try {
            const task = await Task.findById(req.params.id);
            if (!task) return res.status(404).json({ message: "Task not found" });

            await task.deleteOne();
            res.json({ message: "Task deleted" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting task", error: error.message });
        }
    };


    async moveTask (req, res) {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    await task.save();

    res.json({ message: "Task moved successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error moving task", error: error.message });
  }
};


}

export default new TaskController();