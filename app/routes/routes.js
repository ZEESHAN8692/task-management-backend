import  express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/uploadImage.js';
import adminPanelController from '../controller/adminPanelController.js';
import { AuthCheck , adminCheck} from '../middleware/authCheck.js';
import projectController from '../controller/projectController.js';
import taskController from '../controller/taskController.js';
import columnsControllers from '../controller/columnsControllers.js';

const  router = express.Router();

router.post("/register", upload.single("image") ,userController.register);
router.post("/login", userController.login);
router.get("/profile", AuthCheck, userController.getProfile);
router.post("/logout", AuthCheck, userController.logout);
router.get("/members", AuthCheck, userController.getAllUsersForMembers);

// Project routes
router.post("/create-project", AuthCheck,projectController.createProject);
router.get("/projects", AuthCheck, projectController.getAllProjects);
router.get("/projects/:id/members",AuthCheck, projectController.getProjectMembers);
router.get("/single-project/:id",AuthCheck, projectController.getSingleProject);
router.put("/update-project/:id",AuthCheck, projectController.updateProject);
router.delete("/delete-project/:id",AuthCheck, projectController.deleteProject);


// Task routes
router.post("/projects/:projectId/tasks",AuthCheck, taskController.createTask);
router.get("/projects/:projectId/tasks",AuthCheck, taskController.getTasksByProject);
router.get("/tasks/progress/:projectId",AuthCheck, taskController.getTaskProgress);
router.get("/tasks/create-by",AuthCheck, taskController.getTaskAllWithoutProject);
router.get("/tasks/projects-progress",AuthCheck, taskController.getProjectsWithTasks);
router.get("/admin/tasks",AuthCheck, adminCheck, taskController.getTasksCountAdmin);
router.get("/tasks/:id",AuthCheck, taskController.getTaskById);
router.put("/tasks/:id",AuthCheck, taskController.updateTask);
router.delete("/tasks/:id",AuthCheck, taskController.deleteTask);
router.patch("/tasks/:id/move",AuthCheck, taskController.moveTask);



// Admin routes
router.post("/admin/create-user",AuthCheck,adminCheck, upload.single("image"), adminPanelController.createUser);
router.put("/admin/users/:id",AuthCheck,adminCheck, upload.single("image"), adminPanelController.updateUser);
router.get("/admin/users",AuthCheck,adminCheck,adminPanelController.getAllUsers);
router.get("/admin/users/:id",AuthCheck,adminCheck, adminPanelController.getSingleUser);
router.delete("/admin/users/:id", AuthCheck,adminCheck,adminPanelController.deleteUser);


// ---------------- COLUMN MANAGEMENT ----------------

router.get("/admin/columns", AuthCheck,adminCheck, columnsControllers.getColumns);
router.post("/admin/columns", AuthCheck,adminCheck, columnsControllers.createColumn);
router.put("/admin/columns/:id", AuthCheck,adminCheck, columnsControllers.updateColumn);
router.delete("/admin/columns/:id", AuthCheck,adminCheck, columnsControllers.deleteColumn);




export default router;