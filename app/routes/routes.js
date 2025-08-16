import  express from 'express';
import userController from '../controller/userController.js';
import upload from '../middleware/uploadImage.js';

const  router = express.Router();

router.post("/register", upload.single("image") ,userController.register);
router.post("/login", userController.login);

export default router;