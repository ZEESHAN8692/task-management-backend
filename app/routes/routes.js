import  express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/uploadImage.js';
import adminPanelController from '../controller/adminPanelController.js';

const  router = express.Router();

router.post("/register", upload.single("image") ,userController.register);
router.post("/login", userController.login);

// Project routes
router.post("create-project", projectController.createProject);
router.get("/projects", projectController.getAllProjects);
router.get("/single-project/:id", projectController.getSingleProject);
router.put("/update-project/:id", projectController.updateProject);
router.delete("/delete-project/:id", projectController.deleteProject);

// Task routes
router.post("/projects/:projectId/tasks", taskController.createTask);
router.get("/projects/:projectId/tasks", taskController.getTasksByProject);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.patch("/tasks/:id/move", taskController.moveTask);




// Admin routes
router.post("/admin/create-user", upload.single("image"), adminPanelController.createUser);
router.put("/admin/users/:id", upload.single("image"), adminPanelController.updateUser);
router.get("/admin/users",adminPanelController.getAllUsers);
router.get("/admin/users/:id", adminPanelController.getSingleUser);
router.delete("/admin/users/:id", adminPanelController.deleteUser);


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

// @desc Update column
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

// @desc Delete column
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