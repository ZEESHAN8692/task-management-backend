import  express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/uploadImage.js';
import adminPanelController from '../controller/adminPanelController.js';
import { AuthCheck } from '../middleware/authCheck.js';
import projectController from '../controller/projectController.js';
import taskController from '../controller/taskController.js';
import columnsControllers from '../controller/columnsControllers.js';

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

router.get("/admin/columns", AuthCheck, columnsControllers.getColumns);
router.post("/admin/columns", AuthCheck, columnsControllers.createColumn);
router.put("/admin/columns/:id", AuthCheck, columnsControllers.updateColumn);
router.delete("/admin/columns/:id", AuthCheck, columnsControllers.deleteColumn);




export default router;