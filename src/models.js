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
const Plantas = sequelize.define('Plantas', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre_cientifico: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  nombre_comun: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  familia: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  forma_biologica: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tipo_vegetacion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  vulnerada: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  informacion_adicional: {
    type: DataTypes.STRING(300),
    allowNull: false
  }
}, {
  tableName: 'plantas',
  timestamps: false
});

/**
 * Definicion de la tabla observacion
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Observaciones = sequelize.define('Observaciones', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  localidad: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  latitud: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitud: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  fisiografia: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  fecha_colecta: {
    type: DataTypes.DATE,
    allowNull: false
  },
  colector: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  identificador: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  id_plantas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plantas,
      key: 'id'
    }
  }
}, {
  tableName: 'observaciones',
  timestamps: false
});

/**
 * Definicion de la tabla imagen
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Imagenes = sequelize.define('Imagenes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  enlace_imagen: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'imagenes',
  timestamps: false
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
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipoEvento: {
    type: DataTypes.ENUM('INSERCION', 'EDICION', 'CONSULTA', 'ELIMINACION'),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(60),
    allowNull: false
  }
}, {
  tableName: 'log',
  timestamps: false
});

/**
 * Definicion de la tabla ObservacionImagen
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const ObservacionImagenes = sequelize.define('ObservacionImagenes', {
  observaciones_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Observaciones,
      key: 'id'
    }
  },
  imagenes_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Imagenes,
      key: 'id'
    }
  }
}, {
  tableName: 'observacionImagenes',
  timestamps: false
});

/**
 * Definicion de la tabla cuenta
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Cuentas = sequelize.define('Cuentas', {
  correo: {
    type: DataTypes.STRING(128),
    primaryKey: true
  },
  password: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  id_imagen_perfil: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Imagenes,
      key: 'id'
    }
  }
}, {
  tableName: 'cuentas',
  timestamps: false
});

/**
 * Definicion de la tabla aprobacion
 * 
 * @author Yahir Emmanuel Romo Palomino
 * @version 1.0
 */
const Aprobaciones = sequelize.define('Aprobaciones', {
  correo_cuenta: {
    type: DataTypes.STRING(128),
    allowNull: false,
    references: {
      model: Cuentas,
      key: 'correo'
    }
  },
  observaciones_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Observaciones,
      key: 'id'
    }
  }
}, {
  tableName: 'aprobaciones',
  timestamps: false
});

// Definir relaciones
Observaciones.belongsTo(Plantas, { foreignKey: 'id_plantas' });
ObservacionImagenes.belongsTo(Observaciones, { foreignKey: 'observaciones_id' });
ObservacionImagenes.belongsTo(Imagenes, { foreignKey: 'imagenes_id' });
Cuentas.belongsTo(Imagenes, { foreignKey: 'id_imagen_perfil' });
Aprobaciones.belongsTo(Cuentas, { foreignKey: 'correo_cuenta' });
Aprobaciones.belongsTo(Observaciones, { foreignKey: 'observaciones_id' });

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
  Plantas,
  Observaciones
}