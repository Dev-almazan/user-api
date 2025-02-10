
import express from 'express';
import userRouter from './src/routes/userRouter.js';


const app = express();
app.use(express.json());

//Montamos enrutadores servidor 
app.use('/user',userRouter);


// Iniciamos el servidor en el puerto especificado en la configuración
app.listen(8081,() => {
  console.log(`Servicio habilitado en puerto: 8081`)
})

