

import userModel from "../models/user.js";
import jwt from 'jsonwebtoken';

//generamos web token ya que las credenciales estan ok
const secretKey = process.env.secretKey || '654b9d8f07094931a02d*';

class userControllers {


     createUser(req, res) {
        try {
            userModel.postData(req.body);
            res.status(201).json({'status': 'success','message': 'Usuario creado correctamente'});
        } catch (err) {
            res.status(421).json({'status': 'error','message': 'Hubo un problema al crear crear usuario'});
        }
    }


    async getUsers(req, res) {
        const token = req.headers['x-token'];
        try {
            const result = await userModel.getToken(token);
            if (result === null) {
                return res.status(401).send({ 'status': 'error', 'message': 'No existe token de acceso activo para el usuario' })
            }
            const data = await userModel.getData();
            return res.status(200).send({ 'status': 'success', 'items': data.length, 'results': data })
        } catch (error) {
            res.status(421).send({ 'status': 'error', 'message': error })
        }
    }

    async loginUser(req,res) { 
        let data = req.body
        try {
            const result = await  userModel.loginUser(data);
            if(result === null)
            {
                return res.status(421).send({ 'status': 'error', 'message': 'No existe el usuario' })
            }
            
            if (result.password !== data.password){
                return res.status(421).send({ 'status': 'error', 'message': 'Usuario o contraseña incorrecto'  })
            }

            const token = jwt.sign({ username: data.usuario }, secretKey, { expiresIn: '30d' });
 
            const login = {
                "status": true,
                "token": token
            };
            //actualizamos datos de login del usuario

            const updateResult = await userModel.updateUser(result.id,login);


            if (!updateResult) {
                return res.status(500).send({ 'status': 'error', 'message': 'Error al actualizar la sesión' }); // Error en la actualización
            }
            // Si la actualización fue exitosa
             res.status(200).send({ 'status': 'success', 'message': 'Se inicio una nueva sesión', 'result': updateResult }); // Respuesta exitosa

        } catch (error) {
             return res.status(421).send({ 'status': 'error', 'message': error })
        }
    }

    async logoutUser(req, res) {
        const token = req.headers['x-token'];
        try {
            const result = await userModel.getToken(token);
            if (result === null) {
                return res.status(401).send({ 'status': 'error', 'message': 'No existe token de acceso activo para el usuario' })
            }

            const login = {
                "status": false,
                "token": null
            };
            //actualizamos datos de login del usuario
            const updateResult = await userModel.updateUser(result.id,login);
            if (!updateResult) {
                return res.status(500).send({ 'status': 'error', 'message': 'Error al actualizar la sesión' }); // Error en la actualización
            }
            else{
                // Si la actualización fue exitosa
                return res.status(200).send({ 'status': 'success', 'message': 'Se cerro la sesión', 'result': updateResult }); // Respuesta exitosa
            }
        } catch (error) {
            return res.status(421).send({ 'status': 'error', 'message': error })
        }
    }
}

export default new userControllers();