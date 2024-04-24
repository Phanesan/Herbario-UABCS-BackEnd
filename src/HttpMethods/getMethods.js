const { Op } = require('sequelize');
const DATABASE = require('../models.js');

const getObservacion = async (query) => {
    const observacion = await DATABASE.Observacion.findAll({
        where: {
            nombreCientifico: {
                [Op.substring]:`%${query}%`
            }
        }
    })
    .then(res => {
        console.log(res.length);
        if(res.length == 0) {
            return {
                code:204,
                returned: {
                    message:"ok",
                    response: res
                }
            };
        }
        return {
            code:200,
            returned: {
                message:"ok",
                response: res
            }
        };
    })
    .catch(res => {
        return {
            code:400,
            returned: {
                message:"failed",
                response: res
            }
        };
    })
    return observacion;
}

module.exports = {
    getObservacion
};