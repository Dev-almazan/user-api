
import express from 'express';
import userControllers from '../controllers/userController.js';
import userMiddleware from '../middlewares/userMiddlewares.js';
const router = express.Router();

router.post('/',userMiddleware.validateData,userControllers.createUser);
router.get('/', userMiddleware.validateToken, userControllers.getUsers);
router.post('/login', userMiddleware.validateUser, userControllers.loginUser);
router.post('/logout', userMiddleware.validateToken,userControllers.logoutUser);

export default router;