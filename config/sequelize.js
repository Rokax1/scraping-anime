import { Sequelize } from 'sequelize';
import configJson from './config.json' assert { type: 'json' };

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

export default sequelize;