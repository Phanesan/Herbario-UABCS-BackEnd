const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const DATABASE = require('./models.js');

const postMethods = require('./HttpMethods/postMethods.js');
const getMethods = require('./HttpMethods/getMethods.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json({message:"Herbario API"});
});

app.get('/health-status', (req, res) => {
    res.json({message:"conexion establecida"});
});

app.get('/observacion', (req, res) => {
    const search = req.query.search;
    getMethods.getObservacion(search)
    .then(jsonData => {
        res.json(jsonData.returned)
        .status(jsonData.code)
    })
});

/*
JSON Esperado en el body
{
    "nombreCientifico":<60 caracteres>,
    "nombreColoquial":<100 caracteres>,
    "familia":<50 caracteres>,
    "formaBiologica":<40 caracteres>,
    "localidad":<80 caracteres>,
    "ubicacion":<80 caracteres>,
    "coordenadas": {
        "latitud":<latitud>,
        "longitud":<longitud>,
        "altitud":<altitud>
    },
    "fisiografia":<50 caracteres>,
    "tipoVegetacion":<60 caracteres>,
    "fechaColecta":<YYYY-MM-DD>,
    "colector":<100 caracteres>,
    "identificador":<100 caracteres>,
    "informacionAdicional":<255 caracteres>
}
*/
app.post('/observacion', (req, res) => {
    const body = req.body;
    postMethods.postObservacion(body)
    .then(jsonData => {
        res.json(jsonData.returned)
        .status(jsonData.code);
    })
});

app.put('/observacion', (req, res) => {

});

app.delete('/observacion', (req, res) => {

});

app.listen(port, () => {
     console.log(`Servidor corriendo en http://localhost:${port}`);
});