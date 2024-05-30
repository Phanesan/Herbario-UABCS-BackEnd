const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const DATABASE = require('./models.js');

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

app.listen(port, () => {
     console.log(`Servidor corriendo en http://localhost:${port}`);
});