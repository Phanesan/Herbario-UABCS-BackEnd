const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {Cuentas} = require('../models.js')
const {isEmail,isPassword,isName} = require('../utils.js')

const generateToken = (account) => {
    const payload = { correo: account.correo };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '48h' };
    return jwt.sign(payload, secret, options);
};

/**
 * Registro:
 * 
 * - nombre
 * - apellidos
 * - correo
 * - password
 * - repeat_password
 */
router.post('/register', async (req, res) => {
    const body = req.body;

    if(!isEmail(body.correo)) {
        res.status(400).json({status:"failed",message:"El correo no es valido"})
        return;
    }

    if(body.password != body.repeat_password) {
        res.status(400).json({status:"failed",message:"La contraseña no es la misma"})
        return;
    }

    if(!isPassword(body.password)) {
        res.status(400).json({status:"failed",message:"La contraseña debe tener mas de 6 caracteres"})
        return;
    }

    if(!isName(body.nombre) || !isName(body.apellidos)) {
        res.status(400).json({status:"failed",message:"Nombre o apellido invalido"})
        return;
    }
    await Cuentas.create({
        correo: body.correo,
        password: await bcrypt.hash(body.password, await bcrypt.genSalt(10)),
        nombre: body.nombre,
        apellidos: body.apellidos
    }).then(data => {
        res.status(200).json({status:"ok",message:"Usuario registrado correctamente",data});
    }).catch(err => {
        res.status(400).json({status:"failed",message:"La API no puede procesar la solicitud",error_status:err})
    });

});

/**
 * login:
 * 
 * - correo
 * - password
 */
router.post('/login', async (req, res) => {
    const body = req.body;
    
    if(!isEmail(body.correo) || !isPassword(body.password)) {
        res.status(400).json({status:"failed",message:"Autenticación fallida, revise los datos."});
        return;
    }

    const account = await Cuentas.findOne({
        where: {
            correo: body.correo
        }
    }).catch(err => {
        res.status(400).json({status:"failed",message:"Autenticación fallida, revise los datos."});
        return;
    })

    if(!account) {
        res.status(400).json({status:"failed",message:"Autenticación fallida, revise los datos."});
        return;
    }

    if(await bcrypt.compare(body.password,account.dataValues.password)) {
        const token = generateToken(account);

        res.status(200).json({status:"ok",message:"Autenticación validada",token:`herbario ${token}`});
    } else {
        res.status(400).json({status:"failed",message:"Autenticación fallida, revise los datos."});
    }
});

module.exports = router;