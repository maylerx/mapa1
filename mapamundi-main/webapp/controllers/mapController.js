const conexion = require('../database/db')
const uploadImage = require('./cloudinaryController');
const axios = require('axios');

exports.datosEgresados = async (req, res) => {
    try {
        const query = `
            SELECT e.nombres, e.apellidos, e.direccion, e.pais, e.departamento, e.ciudad, e.cell, e.empresa, e.cargo,
                e.email, e.year_graduacion, cc.nombre AS carrera_cursada,
                e.imagen_url, e.portafolio_url, e.coord_x, e.coord_y
            FROM egresados e
            JOIN carrera_cursada cc ON e.carrera_cursada_id = cc.id
        `;

        const results = await new Promise((resolve, reject) => {
            conexion.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        return res.json(results);
    } catch (error) {
        return res.json(error);
    }
}

function obtenerNombreUbicacionPorId(tipo, id) {
    return axios.get(`http://api.geonames.org/getJSON?geonameId=${id}&username=sebasbp`)
        .then(response => {
            const data = response.data;
            if (data) {
                switch (tipo) {
                    case 'pais':
                        return data.countryName;
                    case 'departamento':
                        return data.name;
                    case 'ciudad':
                        return data.name;
                    default:
                        console.log('Tipo no reconocido');
                        return null;
                }
            } else {
                console.log(`No se encontraron datos para el ID ${id}`);
                return null;
            }
        })
        .catch(error => {
            console.error(`Error al obtener los datos: ${error}`);
            return null;
        });
}

exports.borrarEgresado = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email == null) {
            res.json({
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese todos los campos",
            alertIcon: 'info',
            showConfirmButton: true,
            timer: false,
            ruta: ''
        });}
        else {
            conexion.query('DELETE from egresados where ?', {
                email,},(error) => {
                    if (error) {
                        console.log(error);
                        res.json({
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "Ha ocurrido un error al borrar el egresado",
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: ''
                        });
                    } else {
                        res.json({
                            alert: true,
                            alertTitle: "Proceso exitoso",
                            alertMessage: "El egresado se ha borrado correctamente",
                            alertIcon: 'success',
                            showConfirmButton: false,
                            timer: 800,
                            ruta: ''
                        });
                    }
                });
            }
        } catch (error) {
            if (error.message == "Cannot read properties of null (reading 'imagen')"){
                res.json({
                    alert: true,
                    alertTitle: "Advertencia",
                    alertMessage: "La imagen de perfil es obligatoria",
                    alertIcon: 'info',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                });
            }else{
                res.json({
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Ha ocurrido un error inesperado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: ''
                });
            }
        }
        }
   // actualizar
   
   exports.actualizarEgresado = async (req, res) => {
    try {
        const { nombres, apellidos, direccion, pais, departamento,
            ciudad, cell, empresa, cargo, email, year, carrera_cursada, portafolio_url,
            coord_x, coord_y } = req.body;
        console.log(req.body);
        if (!nombres || !apellidos || !coord_x || !coord_y || !email
            || !direccion || !pais || !departamento || !ciudad || !cell || !empresa || !cargo
            || !year || !carrera_cursada || !portafolio_url
            || req.files.imagen === null) {
            console.log("Advertencia: Ingresar el correo electronico");
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese el Correo Electronico",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            const tempFilePath = req.files.imagen.tempFilePath;
            const result = await uploadImage(tempFilePath);
            const rutaWebImagen = result.url
            console.log("RUTA DE LA IMAGEN: ", rutaWebImagen);
            var pais_name = await obtenerNombreUbicacionPorId('pais', pais);
            var departamento_name = await obtenerNombreUbicacionPorId('departamento', departamento);
            var ciudad_name = await obtenerNombreUbicacionPorId('ciudad', ciudad);
            conexion.query('UPDATE egresados SET ? where email = ?', [{
                nombres: nombres,
                apellidos: apellidos,
                direccion: direccion,
                pais: pais_name,
                departamento: departamento_name,
                ciudad: ciudad_name,
                cell: cell,
                empresa: empresa,
                cargo: cargo,
                year_graduacion: year,
                imagen_url: rutaWebImagen,
                coord_x: coord_x,
                coord_y: coord_y,
                carrera_cursada_id: carrera_cursada,
                portafolio_url: portafolio_url,
                datos_publicos: req.body.datos_publicos === "1" ? 1 : 0,
            }, email], (error) => {
                if (error) {
                    res.json(error);
                    /*
                    res.json({
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Ha ocurrido un error al agregar el egresado: "+error,
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    });*/
                } else {
                    res.json({
                        alert: true,
                        alertTitle: "Proceso exitoso",
                        alertMessage: "El egresado se ha agregado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    });
                }
            });
        }
    } catch (error) {
        if (error.message == "Cannot read properties of null (reading 'imagen')"){
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "La imagen de perfil es obligatoria",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }else{
            res.json({
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ha ocurrido un error inesperado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }
    }
}  








exports.agregarEgresado = async (req, res) => {
    try {
        const { nombres, apellidos, direccion, pais, departamento,
                ciudad, cell, empresa, cargo, email, year, carrera_cursada, portafolio_url,
                coord_x, coord_y } = req.body;
        console.log(req.body);
        if (!nombres || !apellidos || !coord_x || !coord_y || !email
            || !direccion || !pais || !departamento || !ciudad || !cell || !empresa || !cargo
            || !year || !carrera_cursada || !portafolio_url
            || req.files.imagen === null) {
            console.log("Advertencia: Ingresar todos los campos");
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese todos los campos",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        } else {
            const tempFilePath = req.files.imagen.tempFilePath;
            const result = await uploadImage(tempFilePath);
            const rutaWebImagen = result.url
            console.log("RUTA DE LA IMAGEN: ", rutaWebImagen);
            var pais_name = await obtenerNombreUbicacionPorId('pais', pais);
            var departamento_name = await obtenerNombreUbicacionPorId('departamento', departamento);
            var ciudad_name = await obtenerNombreUbicacionPorId('ciudad', ciudad);
            conexion.query('INSERT INTO egresados SET ?', {
                nombres: nombres,
                apellidos: apellidos,
                direccion: direccion,
                pais: pais_name,
                departamento: departamento_name,
                ciudad: ciudad_name,
                cell: cell,
                empresa: empresa,
                cargo: cargo,
                email: email,
                year_graduacion: year,
                imagen_url: rutaWebImagen,
                coord_x: coord_x,
                coord_y: coord_y,
                carrera_cursada_id: carrera_cursada,
                portafolio_url: portafolio_url,
                datos_publicos: req.body.datos_publicos === "1" ? 1 : 0,
            }, (error) => {
                if (error) {
                    res.json({
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Ha ocurrido un error al agregar el egresado",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: ''
                    });
                } else {
                    res.json({
                        alert: true,
                        alertTitle: "Proceso exitoso",
                        alertMessage: "El egresado se ha agregado correctamente",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    });
                }
            });
        }
    } catch (error) {
        if (error.message == "Cannot read properties of null (reading 'imagen')"){
            res.json({
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "La imagen de perfil es obligatoria",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }else{
            res.json({
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ha ocurrido un error inesperado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: ''
            });
        }
    }
}