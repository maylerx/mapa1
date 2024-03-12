const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const mapController = require('../controllers/mapController')
const exportController = require('../controllers/exportController');
const checkRoleMiddleware = require('../middlewares/checkRolMiddleware');

//router para las vistas
router.get('/', authController.isAuthenticated, (req, res)=>{    
    res.render('pages/index', {user:req.user, alert:false,customAlert:false})
})
router.get('/login', (req, res)=>{
    res.render('pages/login', {alert:false})
})
router.get('/register', (req, res)=>{
    res.render('pages/register', {alert:false})
})
//router para los métodos del controller
router.post('/register', authController.register)
//permite subir un excel con la informacion de los egresados para importartlos
router.post('/importarEgresadosExcel', authController.importarEgresadosExcel)
router.post('/login', authController.login)
router.post('/agregarEgresado', mapController.agregarEgresado)
//router.post('/borrarEgresado',authController.isAuthenticated, (rec, res)=>{
    //mapController.borrarEgresado(rec, res);
router.post('/borrarEgresado', mapController.borrarEgresado) 
router.post('/actualizarEgresado',mapController.actualizarEgresado)   
    //res.render("pages/index", {user:rec.user,customAlert:true,custom:alert,alert:false});
    //return "hola";
router.get('/logout', authController.logout)
router.get('/datosEgresados', checkRoleMiddleware, mapController.datosEgresados);
router.get('/exportar', exportController.exportar);
//permite descargar la plantilla.ods para una futura importacion de egresados
router.get('/downloadTemplate', exportController.downloadTemplate);

module.exports = router