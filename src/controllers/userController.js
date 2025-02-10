// controllers/userController.js
import UserModel from '../models/user.js';

class userControllers {
   
    // Método para manejar la solicitud GET de usuarios
    async getUsers(req, res) {

        const user = await UserModel.getUsers();
        if(user){
            res.status(200).send(user)
        }
      
    }
}

export default new userControllers();