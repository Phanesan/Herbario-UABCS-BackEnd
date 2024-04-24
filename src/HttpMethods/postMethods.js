const DATABASE = require('../models.js');

const postObservacion = async (body) => {
    const observacion = await DATABASE.Observacion.create(body)
    .then(res => {
        return {
            code: 200,
            returned: {
                message:"ok",
                response: res.toJSON()
            }
        };
    })
    .catch(error => {
        return {
            code: 400,
            returned: {
                message:"failed",
                response: error
            }
        };
    })
    return observacion;
}

module.exports = {
    postObservacion
}