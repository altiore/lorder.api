require('dotenv').config();

const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
const scriptExt = process.env.NODE_ENV === 'production' ? 'js' : 'ts';

module.exports = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',

  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [`${baseDir}/@orm/**/**.entity.${scriptExt}`],
  migrations: [`${baseDir}/@orm/@migrations/*.${scriptExt}`],

  synchronize: false,
  logging: false,

  cli: {
    migrationsDir: `${baseDir}/@orm/@migrations`,
  },
};
