const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const conexion = require('../database/db');
const fs = require('fs');
const dir = 'downloads/';

// Metodo para exportar a CSV
exports.exportar = (req, res) => {
    try {
        conexion.query('SELECT * FROM egresados', (error, results, fields) => {
            if (error) {
                console.error('Error al ejecutar la consulta:', error);
                res.status(500).send('Error interno del servidor');
                return;
            }
            //crea la carpeta  do'nde se almacenara' la exportacion (servidor)
            if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        // Crear el archivo si no existe, 
        const filePath = `${dir}/egresadosdata.csv`;

        if (!fs.existsSync(filePath)){
            fs.writeFileSync(filePath, '');
        }

            const csvWriter = createCsvWriter({
                path: 'downloads/egresadosdata.csv',
                header: fields.map(field => ({ id: field.name, title: field.name }))
            });

            csvWriter.writeRecords(results)
                .then(() => {
                    res.download('downloads/egresadosdata.csv');
                })
                .catch(error => {
                    console.error('Error al escribir en el archivo CSV:', error);
                    res.status(500).send('Error interno del servidor');
                });
        });
    } catch (error) {
        console.error('Error al exportar a CSV:', error);
        res.status(500).send('Error interno del servidor');
    }
}
// Metodo para descargar la plantilla de egresados a CSV
exports.downloadTemplate = (req, res) => {
    try {
        // Crear el archivo si no existe, 
        res.download('downloads/importacionDeEgresadosTemplate.ods');
        } catch (error) {
        console.error('Error al descargar la plantilla :', error);
        res.status(500).send('Error interno del servidor');
    }
}

