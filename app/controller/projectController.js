import Project from '../model/projectModel.js';

class ProjectController {
    async createProject(req, res) {
        try {
            const { name, description, members } = req.body;

            const project = new Project({
                name,
                description,
                createdBy: req.user._id, // from authMiddleware
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

            if (req.user.role === "admin") {
                projects = await Project.find().populate("createdBy", "name email").populate("members", "name email");
            } else {
                projects = await Project.find({
                    $or: [{ createdBy: req.user._id }, { members: req.user._id }]
                }).populate("createdBy", "name email").populate("members", "name email");
            }

            res.json(projects);
        } catch (error) {
            res.status(500).json({ message: "Error fetching projects", error: error.message });
        }
    };

    async getSingleProject(req, res) {
        try {
            const project = await Project.findById(req.params.id)
                .populate("createdBy", "name email")
                .populate("members", "name email");

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
            if (String(project.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
                return res.status(403).json({ message: "Not authorized to update this project" });
            }

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

            // only creator or admin can delete
            if (String(project.createdBy) !== String(req.user._id) && req.user.role !== "admin") {
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