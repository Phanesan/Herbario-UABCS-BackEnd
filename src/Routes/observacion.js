const express = require('express');
const router = express.Router();
const { Observaciones } = require('../models.js')
const { Op } = require('sequelize');


router.post('/', async (req, res) => {
    const body = req.body;
    await Observaciones.create(body).then(data => {
        res.status(200).json({status:"ok",message:"Observación cargada a la base de datos"});
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err})
    })
});


router.get('/:id', async (req, res) => {
    const id = req.params.id;

    await Observaciones.findAll({
        where: {
            id: id
        }
    }).then(data => {
        res.status(200).json({status:"ok",message:data});
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err});
    })
});


router.get('/', async (req, res) => {
    const body = req.body;
    console.log(body);
    await Observaciones.findAll({
        where: {
            latitud: {
              [Op.between]: [body.south, body.north]
            },
            longitud: {
              [Op.between]: [body.east, body.west]
            }
        }
    }).then(data => {
        res.status(200).json({status:"ok",message:data});
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err});
    })
});


router.put('/', async (req, res) => {
    const body = req.body;

    if(Object.keys(body).length === 0) {
        res.status(400).json({status:"failed",message:"La petición no contiene información en el body"});
        return;
    }

    await Observaciones.update(body,{
        where: {
            id: body.id
        }
    }).then(data => {
        if(data[0] === 0) {
            res.status(200).json({status:"ok",message:"No se registraron cambios o la información es erronea"})
        } else {
            res.status(200).json({status:"ok",message:"La información de la observación se modifico correctamente",data});
        }
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err});
    })
});


router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await Observaciones.destroy({
        where: {
            id: id
        }
    }).then(data => {
        if(data === 0) {
            res.status(200).json({status:"ok",message:"No se encontro una ID para eliminar"})
        } else {
            res.status(200).json({status:"ok",message:"Observación eliminada correctamente"});
        }
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err})
    })
});

module.exports = router;