const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_IP,
});

const Observacion = sequelize.define('Observacion', {
  idObservacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  nombreCientifico: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true
  },
  nombreColoquial: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  familia: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  formaBiologica: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  localidad: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  coordenadas: {
    type: DataTypes.JSON,
    allowNull: false
  },
  fisiografia: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tipoVegetacion: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  fechaColecta: {
    type: DataTypes.DATEONLY,
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
  informacionAdicional: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Sin informacion adicional.'
  },
},{timestamps:false});

const ListaImagenes = sequelize.define('ListaImagenes', {
  idListaImagenes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  enlaceImagen: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  ultimaFechaModificacion: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
},{timestamps:false});

const Log = sequelize.define('Log', {
  idLog: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tipoEvento: {
    type: DataTypes.ENUM('INSERCION', 'EDICION', 'AÑADIDO', 'ELIMINADO'),
    allowNull: false
  },
  origen: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
},{timestamps:false});

Observacion.hasMany(ListaImagenes, { foreignKey: 'idObservacion' });
ListaImagenes.belongsTo(Observacion, { foreignKey: 'idObservacion' });

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Database synchronization failed: ', err);
  });

module.exports = { Observacion, ListaImagenes, Log, sequelize };