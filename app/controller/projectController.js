import Project from '../model/projectModel.js';
import Task from '../model/taskModel.js';


class ProjectController {
    async createProject(req, res) {
        try {
            const { name, description, members } = req.body;

            const project = new Project({
                name,
                description,
                createdBy: req.user.id, // from authMiddleware
                members: members || []
            });

            await project.save();
            res.status(201).json({ message: "Project created", project });
        } catch (error) {
            res.status(500).json({ message: "Error creating project", error: error.message });
        }
    };


    async getAllProjects(req, res) {
        try {
            let projects;

            // Check if the user is an admin or not
            if (req.user.role === "admin") {
                // If the user is an admin, return all projects
                projects = await Project.find()
                    .populate("createdBy", "name email image")
                    .populate("members", "name email image");
            } else {
                // If the user is not an admin, show only the projects that the user created
                projects = await Project.find(
                    {
                        $or: [
                            { createdBy: req.user.id },
                            { members: req.user.id }
                        ]
                    }
                )
                    .populate("createdBy", "name email image")
                    .populate("members", "name email image");


            }

            res.json({ status: true, message: "Projects fetched", data: projects });
        } catch (error) {
            res.status(500).json({ message: "Error fetching projects", error: error.message });
        }
    }


    async getProjectMembers(req, res) {
        try {
            const project = await Project.findById(req.params.id)
                .populate("members", "name email image");

            if (!project) return res.status(404).json({ message: "Project not found" });

            res.json(project.members);
        } catch (error) {
            res.status(500).json({ message: "Error fetching project members", error: error.message });
        }
    }


    async getSingleProject(req, res) {
        try {
            const project = await Project.findById(req.params.id)
                .populate("createdBy", "name email image")
                .populate("members", "name email image");

            if (!project) return res.status(404).json({ message: "Project not found" });

            res.json(project);
        } catch (error) {
            res.status(500).json({ message: "Error fetching project", error: error.message });
        }
    };

    async updateProject(req, res) {
        try {
            const { name, description, members } = req.body;

            const project = await Project.findById(req.params.id);

            if (!project) return res.status(404).json({ message: "Project not found" });

            // only creator or admin can update
            // if (String(project.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
            //     return res.status(403).json({ message: "Not authorized to update this project" });
            // }

            project.name = name || project.name;
            project.description = description || project.description;
            project.members = members || project.members;

            await project.save();
            res.json({ message: "Project updated", project });
        } catch (error) {
            res.status(500).json({ message: "Error updating project", error: error.message });
        }
    };

    async deleteProject(req, res) {
        try {
            const project = await Project.findById(req.params.id);

            if (!project) return res.status(404).json({ message: "Project not found" });

            // only admin and creator can delete
            if (req.user.role !== "admin" && String(project.createdBy) !== String(req.user.id)) {
                return res.status(403).json({ message: "Not authorized to delete this project" });
            }

            await project.deleteOne();
            res.json({ message: "Project deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting project", error: error.message });
        }
    };



}

export default new ProjectController();
