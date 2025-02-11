import jwt from 'jsonwebtoken';
//generamos web token ya que las credenciales estan ok
const secretKey = process.env.secretKey || '654b9d8f07094931a02d*';


class userMiddleware {

    validateData = (req, res, next) => {
        //validamos que la solicitud no venga vacia
        if (Object.keys(req.body).length !== 0) {
            
                //validamos propiedades obligatorios
                let camposObligatorios = this.camposObligatorios(req.body);
                if (camposObligatorios.length > 0) {
                     res.status(421).json({ 'status': 'error', 'message': 'Favor de completar propiedades del usuario', 'results': camposObligatorios }); // Enviar errores en la respuesta
                }

                //desestructuro cuerpo de la peticion
                const { nombre, materno = null , paterno, email = null , telefono, usuario, password } = req.body;
                let letras = /^([á-ú-Á-Ú-a-z-A-Z-ñ ._])+$/;
                let numeros = /^([0-9 ])+$/;

                //validamos cada propiedad de acuerdo al formato
                if(nombre.length > 40 || letras.test(nombre) === false) 
                {
                     res.status(421).json({ 'status': 'error', 'message': 'El campo nombre es inválido.', 'results': [] });
                }
                else if(materno !== null && (materno.length > 40 || letras.test(materno) === false )) {
                     res.status(421).json({ 'status': 'error', 'message': 'El campo apellido materno es inválido.', 'results': [] });
                }
                else if(paterno.length > 40 || letras.test(paterno) === false) {
                     res.status(421).json({ 'status': 'error', 'message': 'El campo apellido paterno es inválido.', 'results': [] });
                }
                else if (telefono.length !== 10 || numeros.test(telefono) === false) {
                     res.status(421).json({ 'status': 'error', 'message': 'El campo número de teléfono es inválido  ', 'results': [] });
                }
                else if(email !== null && email.length > 40 || email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                     res.status(421).json({ 'status': 'error', 'message': 'El campo correo electrónico es inválido.', 'results': [] });
                }
                else if(usuario.length > 30 || !/^[a-zA-Z0-9]+$/.test(usuario)) {
                     res.status(421).json({ 'status': 'error', 'message': 'El nombre de usuario no debe superar los 30 caracteres y no debe contener caracteres especiales.', 'results': [] });
                }
                else if(password.length > 20) {
                      res.status(421).json({ 'status': 'error', 'message': 'La contraseña no debe superar los 20 caracteres', 'results': [] });
                }
                else
                {
                    //continuar el proceso al cumplir las validaciones
                    next();
                }
        }
         res.status(421).send({ 'status': 'error', 'message': 'Favor de completar propiedades del usuario', 'errores': [] })
    }

    camposObligatorios(body){
        const { nombre = null, paterno = null,  telefono = null,  usuario = null, password = null } = body;

        const errores = [];

        if (!nombre) {
            errores.push("Nombre es requerido");
        }
        if (!paterno) {
            errores.push("Apellido paterno es requerido");
        }
        if (!telefono) {
            errores.push("Teléfono es requerido");
        }
        if (!usuario) {
            errores.push("Usuario es requerido");
        }
        if (!password) {
            errores.push("Contraseña es requerida");
        }

        return errores;
    }

    validateUser= (req, res, next) => {
        //validamos que la solicitud no venga vacia
        if (Object.keys(req.body).length !== 0) {

            //desestructuro cuerpo de la peticion
            const { usuario = null, telefono = null, password } = req.body;
            let numeros = /^([0-9 ])+$/;

            // Validamos si se proporcionó usuario o teléfono
            if (usuario || telefono) {
                
                //validamos cada propiedad de acuerdo al formato
                if(usuario && (usuario.length > 30 || !/^[a-zA-Z0-9]+$/.test(usuario))) {
                    res.status(421).json({ 'status': 'error', 'message': 'El nombre de usuario es inválido', 'results': [] });
                }
                else if (telefono && (telefono.length !== 10 || numeros.test(telefono) === false) ) {
                    res.status(421).json({ 'status': 'error', 'message': 'El campo número de teléfono es inválido y solo se permiten 10 dígitos. ', 'results': [] });
                }
                else if (password.length > 20) {
                    res.status(421).json({ 'status': 'error', 'message': 'La contraseña es invalido', 'results': [] });
                }
                else {
                    //continuar el proceso al cumplir las validaciones
                    next();
                }

            }
            else
            {
                res.status(421).json({ 'status': 'error', 'message': 'Debe proporcionar el nombre de usuario o el número de teléfono', 'results': [] });
            }
            
        }
        else
        {
            res.status(421).send({ 'status': 'error', 'message': 'Favor de completar propiedades del usuario', 'errores': [] })
        }
       
    }

    validateToken=(req, res, next)=>{
       
            const token = req.headers['x-token'];
            if (!token) {
                res.status(421).send({ 'status': 'error', 'message': 'Token de acceso no proporcionado' })
            }
            
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ 'status': 'error', 'message': 'Token de acceso no es valido' });
                }
                next(); 
            });

    }
   
}

export default new userMiddleware();