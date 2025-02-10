
import express from 'express';
import userControllers from '../controllers/userController.js';
const router = express.Router();

//router.post('/',userControllers.createUser);
router.get('/',userControllers.getUsers);
//router.get('/:uid',userControllers.getUser);
//router.post('/login',userControllers.userLogin);
//router.patch('/logout',userControllers.userLogout);


export default router;