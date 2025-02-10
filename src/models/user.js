 
import mongoose from "mongoose";

// Defino el esquema para los usuarios
const userSchema = new mongoose.Schema({
    name: String
});

// Creo el modelo a partir del esquema
const User = mongoose.model('User', userSchema,'users');

class UserModel {
    constructor() {
        const uri = "mongodb+srv://devAlmazan:qZ8QK!B4Q-!f4vp@cluster0.hzkvq.mongodb.net/retailDb?retryWrites=true&w=majority&appName=Cluster0";
        mongoose.connect(uri)
            .then(() => {
                console.log('Conectado a MongoDB Atlas');
            })
            .catch((err) => {
                console.error('Error al conectar a MongoDB Atlas:', err);
            });
    }

    // Método para obtener todos los usuarios
    async getUsers() {
        try {
            const users = await User.find(); // Obtengo los usuarios de la colección
            return users;
        } catch (err) {
            console.log(err)
            return false;
        }
    }
}

export default new UserModel();