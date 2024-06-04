const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

/**
 * Enlace a la base de datos
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_IP,
  dialect: 'mysql',
});

/**
 * Definicion de la tabla planta
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Planta = sequelize.define('Planta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre_cientifico: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  nombre_comun: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  familia: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  forma_biologica: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  tipo_vegetacion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  vulnerada: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  informacion_adicional: {
    type: DataTypes.STRING(300),
    allowNull: false,
  },
}, {
  tableName: 'plantas',
  timestamps: false,
});

/**
 * Definicion de la tabla observacion
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Observacion = sequelize.define('Observacion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  localidad: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  coordenadas: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  fisiografia: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fecha_colecta: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  colector: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  identificador: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  plantas_idPlantas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Planta,
      key: 'id',
    },
  },
}, {
  tableName: 'observaciones',
  timestamps: false,
});

/**
 * Definicion de la tabla imagen
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Imagen = sequelize.define('Imagen', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  enlace_imagen: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'imagenes',
  timestamps: false,
});

/**
 * Definicion de la tabla log
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tipoEvento: {
    type: DataTypes.ENUM('INSERCION', 'EDICION', 'CONSULTA', 'ELIMINACION'),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
}, {
  tableName: 'log',
  timestamps: false,
});

/**
 * Definicion de la tabla ObservacionImagen
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const ObservacionImagen = sequelize.define('ObservacionImagen', {
  observaciones_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Observacion,
      key: 'id',
    },
  },
  imagenes_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Imagen,
      key: 'id',
    },
  },
}, {
  tableName: 'observacionImagenes',
  timestamps: false,
});

/**
 * Definicion de la tabla cuenta
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Cuenta = sequelize.define('Cuenta', {
  UID_cuenta: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
  id_imagen_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Imagen,
      key: 'id',
    },
  },
}, {
  tableName: 'cuentas',
  timestamps: false,
});

/**
 * Definicion de la tabla aprobacion
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Aprobacion = sequelize.define('Aprobacion', {
  UID_cuenta: {
    type: DataTypes.STRING(128),
    primaryKey: true,
    references: {
      model: Cuenta,
      key: 'UID_cuenta',
    },
  },
  observaciones_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Observacion,
      key: 'id',
    },
  },
}, {
  tableName: 'aprobaciones',
  timestamps: false,
});

// Definir relaciones
Planta.hasMany(Observacion, { foreignKey: 'plantas_idPlantas' });
Observacion.belongsTo(Planta, { foreignKey: 'plantas_idPlantas' });

Observacion.belongsToMany(Imagen, { through: ObservacionImagen, foreignKey: 'observaciones_id' });
Imagen.belongsToMany(Observacion, { through: ObservacionImagen, foreignKey: 'imagenes_id' });

Cuenta.belongsTo(Imagen, { foreignKey: 'id_imagen_perfil' });
Aprobacion.belongsTo(Cuenta, { foreignKey: 'UID_cuenta' });
Aprobacion.belongsTo(Observacion, { foreignKey: 'observaciones_id' });

/**
 * Sincronizacion con la base de datos
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 * @description Sincroniza las tablas creadas anteriormente a la base de datos
 */
sequelize.sync({ force: false }).then(() => {
  console.log('Tablas creadas!');
}).catch(error => {
  console.error('Error creando las tablas: ', error);
});

module.exports = {
  Planta
}