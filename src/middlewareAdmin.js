const jwt = require('jsonwebtoken');

const authenticateTokenAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({status:"failed",message:"Solicitud no autorizada"})
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({status:"failed",message:"Solicitud denegada"})
    }

    if(user.rol !== 10) {
        return res.status(403).json({status:"failed",message:"Solicitud denegada"})
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateTokenAdmin;