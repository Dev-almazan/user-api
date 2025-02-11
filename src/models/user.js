import mongoose from "mongoose";

class userModel {
    constructor(colletion) {
        this.uri = process.env.MONGODB_URI || "mongodb+srv://devAlmazan:qZ8QK!B4Q-!f4vp@cluster0.hzkvq.mongodb.net/retailDb?retryWrites=true&w=majority&appName=Cluster0";
        this.db = null;
        this.model = mongoose.model(colletion, new mongoose.Schema({
            nombre: { type: String, required: true },
            paterno: { type: String, required: true },
            materno: { type: String, required: false },
            telefono: { type: Number, required: true },
            email: { type: String, required: false},
            usuario: { type: String, required: true },
            password: { type: String, required: true },
            auth: { 
                status: { type: Boolean, default: false }, 
                token: { type: String, default: null }
            }
        }));
        this.connect();
    }

    async connect() {
        try {
            console.log('Conectado a MongoDB');
            this.db = await mongoose.connect(this.uri);
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            this.db = false;
        }
    }
    // Método para tarenos usuarios
    async getData() {
        try {
            const users = await this.model.find().select('usuario ');
            return users;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async getToken(token) {
        try {
            const result = await this.model.findOne({ 'auth.token': token });

            if (result) {
                return result;
            }
            else {
                return null
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    // Método para insertar usuarios
    async postData(datos) {
        try {
            return await this.model(datos).save();
        } catch (err) {
            return err;
        }
    }

    // Método para tarenos usuarios

    async loginUser(data) {
        try {
            const result = await this.model.findOne({
                $or: [
                    { 'usuario': data.usuario },
                    { 'telefono': data.telefono } 
                ]
            });

            if(result) {
                return  result ;
            }
            else
            {
               return null     
            } 
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async updateUser(id,datos) {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { $set: { auth: datos } }, 
                { new: true } 
            );
        } catch (err) {
            return err;
        }
    }
}

export default new userModel('users');