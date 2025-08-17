import  express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/uploadImage.js';
import adminPanelController from '../controller/adminPanelController.js';
import { AuthCheck } from '../middleware/authCheck.js';

const  router = express.Router();

router.post("/register", upload.single("image") ,userController.register);
router.post("/login", userController.login);

// Project routes
router.post("create-project", AuthCheck,projectController.createProject);
router.get("/projects",AuthCheck, projectController.getAllProjects);
router.get("/single-project/:id",AuthCheck, projectController.getSingleProject);
router.put("/update-project/:id",AuthCheck, projectController.updateProject);
router.delete("/delete-project/:id",AuthCheck, projectController.deleteProject);


// Task routes
router.post("/projects/:projectId/tasks",AuthCheck, taskController.createTask);
router.get("/projects/:projectId/tasks",AuthCheck, taskController.getTasksByProject);
router.get("/tasks/:id",AuthCheck, taskController.getTaskById);
router.put("/tasks/:id",AuthCheck, taskController.updateTask);
router.delete("/tasks/:id",AuthCheck, taskController.deleteTask);
router.patch("/tasks/:id/move",AuthCheck, taskController.moveTask);



// Admin routes
router.post("/admin/create-user",AuthCheck, upload.single("image"), adminPanelController.createUser);
router.put("/admin/users/:id",AuthCheck, upload.single("image"), adminPanelController.updateUser);
router.get("/admin/users",AuthCheck,adminPanelController.getAllUsers);
router.get("/admin/users/:id",AuthCheck, adminPanelController.getSingleUser);
router.delete("/admin/users/:id", AuthCheck,adminPanelController.deleteUser);


// ---------------- COLUMN MANAGEMENT ----------------
export const getColumns = async (req, res) => {
  try {
    const columns = await Column.find().sort({ order: 1 });
    res.json(columns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching columns", error: error.message });
  }
};


export const createColumn = async (req, res) => {
  try {
    const { name, order } = req.body;
    const column = new Column({ name, order });
    await column.save();
    res.status(201).json({ message: "Column created", column });
  } catch (error) {
    res.status(500).json({ message: "Error creating column", error: error.message });
  }
};


// @route PUT /admin/columns/:id
export const updateColumn = async (req, res) => {
  try {
    const { name, order } = req.body;

    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    column.name = name || column.name;
    column.order = order ?? column.order;

    await column.save();
    res.json({ message: "Column updated", column });
  } catch (error) {
    res.status(500).json({ message: "Error updating column", error: error.message });
  }
};


// @route DELETE /admin/columns/:id
export const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: "Column not found" });

    await column.deleteOne();
    res.json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting column", error: error.message });
  }
};




export default router;