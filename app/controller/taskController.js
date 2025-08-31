

import Task from '../model/taskModel.js';
import Project from '../model/projectModel.js';
import mongoose from 'mongoose';

class TaskController {
    async createTask(req, res) {
        try {
            const { title, description, status, dueDate, assignedTo } = req.body;

            const task = new Task({
                title,
                description,
                status,
                dueDate,
                assignedTo,
                projectId: req.params.projectId,
                createBy: req.user.id
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

            res.json({ sataus: true, message: "Tasks fetched", data: tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error: error.message });
        }
    };

    async getTasksCountAdmin(req, res) {
        try {
            if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized to get tasks count" });

            const tasks = await Task.find().countDocuments();
            res.json({ message: "Tasks count fetched", tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks count", error: error.message });
        }
    }

    async getTaskAllWithoutProject(req, res) {
        try {
            const tasks = await Task.find({ createBy: req.user.id })
            res.json({ message: "Tasks fetched", data: tasks });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error: error.message });
        }
    }


    // Controller
    // async getProjectsWithTasks(req, res) {
    //     try {
    //         // Pehle current user ke sare projects nikal lo
    //         const projects = await Project.find({ createdBy: req.user.id });

    //         // Project wise tasks count nikalne ke liye aggregation
    //         const tasks = await Task.aggregate([
    //             {
    //                 $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) }
    //             },
    //             {
    //                 $group: {
    //                     _id: "$projectId",
    //                     total: { $sum: 1 },
    //                     completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
    //                     inProgress: { $sum: { $cond: [{ $eq: ["$status", "inProgress"] }, 1, 0] } },
    //                     toDo: { $sum: { $cond: [{ $eq: ["$status", "toDo"] }, 1, 0] } }
    //                 }
    //             }
    //         ]);

    //         // project + task details ko merge kar do
    //         const result = projects.map(project => {
    //             const taskStat = tasks.find(t => t._id.toString() === project._id.toString());
    //             return {
    //                 projectId: project._id,
    //                 name: project.name,
    //                 totalTasks: taskStat ? taskStat.total : 0,
    //                 completed: taskStat ? taskStat.completed : 0,
    //                 inProgress: taskStat ? taskStat.inProgress : 0,
    //                 toDo: taskStat ? taskStat.toDo : 0,
    //                 progress: taskStat ? ((taskStat.completed / taskStat.total) * 100).toFixed(2) + "%" : "0%"
    //             };
    //         });

    //         res.json({ message: "Projects with tasks fetched", data: result });
    //     } catch (error) {
    //         res.status(500).json({ message: "Error fetching project tasks", error: error.message });
    //     }
    // }
    //     async  getProjectsWithTasks(req, res) {
    //     try {
    //         // Current user ke sare projects
    //         const projects = await Project.find({ createdBy: req.user.id });
    //         console.log("📌 Projects:", projects);

    //         // Project wise tasks count (aggregation)
    //         const tasks = await Task.aggregate([
    //             {
    //                 $match: {
    //                     // Agar Task schema me createdBy ObjectId hai to ObjectId use karo
    //                     $or: [
    //                         { createdBy: req.user.id }, // string case
    //                         { createdBy: new mongoose.Types.ObjectId(req.user.id) } // ObjectId case
    //                     ]
    //                 }
    //             },
    //             {
    //                 $group: {
    //                     _id: "$projectId",
    //                     total: { $sum: 1 },
    //                     completed: {
    //                         $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
    //                     },
    //                     inProgress: {
    //                         $sum: { $cond: [{ $eq: ["$status", "inProgress"] }, 1, 0] }
    //                     },
    //                     toDo: { $sum: { $cond: [{ $eq: ["$status", "toDo"] }, 1, 0] } }
    //                 }
    //             }
    //         ]);

    //         console.log("📌 Aggregated Tasks:", tasks);

    //         // Merge projects + task stats
    //         const result = projects.map(project => {
    //             // compare project._id aur aggregation ke _id
    //             const taskStat = tasks.find(
    //                 t => t._id.toString() === project._id.toString()
    //             );

    //             return {
    //                 projectId: project._id,
    //                 name: project.name,
    //                 totalTasks: taskStat ? taskStat.total : 0,
    //                 completed: taskStat ? taskStat.completed : 0,
    //                 inProgress: taskStat ? taskStat.inProgress : 0,
    //                 toDo: taskStat ? taskStat.toDo : 0,
    //                 progress: taskStat
    //                     ? ((taskStat.completed / taskStat.total) * 100).toFixed(2) + "%"
    //                     : "0%"
    //             };
    //         });

    //         res.json({ message: "Projects with tasks fetched", data: result });
    //     } catch (error) {
    //         console.error("❌ Error in getProjectsWithTasks:", error);
    //         res
    //             .status(500)
    //             .json({ message: "Error fetching project tasks", error: error.message });
    //     }
    // }


    async getProjectsWithTasks(req, res) {
        try {
            const userId = new mongoose.Types.ObjectId(req.user.id);

            // Step 1: Aggregate tasks where user is involved
            const taskStats = await Task.aggregate([
                {
                    $match: {
                        $or: [
                            { assignedTo: userId },
                            { createBy: userId }
                        ],
                        projectId: { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: "$projectId",
                        total: { $sum: 1 },
                        completed: {
                            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
                        },
                        inProgress: {
                            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
                        },
                        toDo: {
                            $sum: { $cond: [{ $eq: ["$status", "To-Do"] }, 1, 0] }
                        }
                    }
                }
            ]);

            // Step 2: Get ALL projects created by user
            const projects = await Project.find({ createdBy: userId });

            // Step 3: Merge stats with all projects
            const result = projects.map(project => {
                const stat = taskStats.find(
                    t => t._id.toString() === project._id.toString()
                );

                const progress = stat && stat.total > 0
                    ? ((stat.completed / stat.total) * 100).toFixed(2) + "%"
                    : "0%";

                return {
                    projectId: project._id,
                    name: project.name,
                    description: project.description,
                    totalTasks: stat ? stat.total : 0,
                    completed: stat ? stat.completed : 0,
                    inProgress: stat ? stat.inProgress : 0,
                    toDo: stat ? stat.toDo : 0,
                    progress
                };
            });

            res.json({
                message: "All projects with tasks (0 if no tasks)",
                data: result
            });
        } catch (error) {
            console.error("❌ Error in getUserProjectsWithTasks:", error);
            res.status(500).json({
                message: "Error fetching project tasks",
                error: error.message
            });
        }
    }





    async getTaskProgress(req, res) {
        try {
            const tasks = await Task.find({ projectId: req.params.projectId }).countDocuments();
            const completedTasks = await Task.find({ projectId: req.params.projectId, status: "Completed" }).countDocuments();
            const progress = (completedTasks / tasks) * 100;
            const totalTasks = tasks - completedTasks;
            res.json({ message: "Task progress fetched", progress, totalTasks });
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


    async moveTask(req, res) {
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