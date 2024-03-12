const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

const xlsx = require('xlsx');
const conexion = require('../database/db')
const { promisify } = require('util')


// Funcion de registro de usuarios (Todos con rol usuario)
exports.importarEgresadosExcel = async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.files.file.tempFilePath, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Asume que quieres leer la primera hoja
        const worksheet = workbook.Sheets[sheetName];
        // Obtener el valor de la celda A15
        var filaActual = 16
        var errorMessages = "";
        while( worksheet['A'+filaActual] != null){
            try{
                const egresado = {};
                egresado['nombres'] = worksheet['A'+filaActual].v;
                egresado['apellidos'] = worksheet['B'+filaActual].v;
                egresado['direccion'] = worksheet['C'+filaActual].v;
                egresado['cell'] = worksheet['D'+filaActual].v;
                egresado['empresa'] = worksheet['E'+filaActual].v;
                egresado['cargo'] = worksheet['F'+filaActual].v;
                egresado['ciudad'] = worksheet['G'+filaActual].v;
                egresado['departamento'] = worksheet['H'+filaActual].v;
                egresado['pais'] = worksheet['I'+filaActual].v;
                egresado['email'] = worksheet['J'+filaActual].v;
                egresado['year_graduacion'] = worksheet['K'+filaActual].v;
                egresado['coord_x'] = worksheet['L'+filaActual].v;
                egresado['coord_y'] = worksheet['M'+filaActual].v;
                egresado['datos_publicos'] = true;
                egresado['portafolio_url'] = worksheet['N'+filaActual].v;
                egresado['carrera_cursada_id'] =  await obtener_id_carrera_cursada( worksheet['O'+filaActual].v);
                //aqui se pueden agregar mas campos, dependiendo del excel (si se agregan otros campos etc)
                await insertar_egresado_importacion(egresado);

            }catch (error){
                errorMessages += ' fila : '+filaActual+' causa de error :' +error.message + '\n';
            }finally{
                filaActual++;
            }
        }
       if(errorMessages.length === 0  ){
            res.json({ message: 'Archivo subido exitosamente' });
        }
        else {
            res.json({ message: 'No todos los egresados se subieron exitosamente, las filas sin subir son: \n' + errorMessages });
        }
        
    } catch (error) {
            console.log(error)
    }
}

//funcion que inserta un egresado a la base de datos
async function insertar_egresado_importacion(egresado){
 await new Promise((resolve, reject) => {
    conexion.query('INSERT INTO egresados SET ?', egresado,  async (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
}

//funcion que obtiene el id de una carrera cursada usando el nombre
async function obtener_id_carrera_cursada(nombre_carrera){
        var id = -1;
        await new Promise((resolve, reject) => {
            conexion.query('select id from carrera_cursada where nombre = ? ', nombre_carrera, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    id = results[0].id;
                    resolve();
                }
            });
        });
        return id;
}

// Funcion de registro de usuarios (Todos con rol usuario)
exports.register = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        let passHash = await bcryptjs.hash(pass, 8)
        if (!user || !name || !pass) {
            res.render('pages/register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese su nombre de usuario, nombre completo y contraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            })
        } else {
            conexion.query('INSERT INTO users SET ?', { user: user, name: name, pass: passHash }, async (error, results) => {
                if (error) {
                    if(error.sqlMessage.includes("Duplicate entry")){
                        mensaje = "El nombre de usuario ya está en uso";
                    }else{
                        mensaje = "Ha ocurrido un error inesperado";
                    }
                    res.render('pages/register', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: mensaje,
                        alertIcon: 'info',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    });
                } else {
                    res.render('pages/register', {
                        alert: true,
                        alertTitle: "Registro exitoso",
                        alertMessage: "¡REGISTRO CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
            });
        }
    } catch (error) {
        console.log(error)
    }
}

// Funcion de login de usuarios
exports.login = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass

        if (!user || !pass) {
            res.render('pages/login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y constraseña",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
                // Validacion de usuario con credenciales incorrectas
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    res.render('pages/login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else {
                    // Inicio de sesión OK
                    const id = results[0].id
                    const token = jwt.sign({ id: id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })

                    console.log("TOKEN: " + token + " para el USUARIO : " + user)

                    // Definicion de opciones de la cookie como fecha de expiracion y httpOnly
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)

                    res.render('pages/login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results) => {
                if (!results) { return next() }
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log("ERROR: " + error + " en la autenticacion")
            res.redirect('login')
        }
    } else {
        res.redirect('login')
    }
}

exports.logout = (req, res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}