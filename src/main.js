// Aqui se agregan las importaciones de los modulos
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressFileUpload = require('express-fileupload');
const path = require('path');

// Aqui se agregan los accesos a otros archivos
const DATABASE = require('./models.js');
const fileRouter = require('./Routes/files.js');
const plantaRouter = require('./Routes/planta.js')

// Aqui se agregan los archivos que necesiten inicializarse
require('./cleanTemporalFolder.js')
require('dotenv').config();

// Aqui se inicializan las constantes de este archivo
const port = process.env.PORT || 3000;

// Aqui se agregan los Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'uploads')
}))

// Aqui se agregan los Routers
app.use('/files', fileRouter);
app.use('/planta', plantaRouter);

// Aqui se agregan las solicitudes principales
app.get('/', (req, res) => {
    res.json({status:"ok", message:"Herbario API"});
});

app.get('/health-status', (req, res) => {
    res.json({status:"ok"});
});

// Se inicia el servidor
app.listen(port, () => {
     console.log(`Servidor corriendo en http://localhost:${port}`);
});