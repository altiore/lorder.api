if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const baseDir = process.env.BASE_DIR || 'dist';
const scriptExt = baseDir === 'dist' ? 'js' : 'ts';

module.exports = {
  type: process.env.TYPEORM_CONNECTION || 'postgres',

  host: process.env.TYPEORM_HOST || 'postgres',
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [`${baseDir}/**/**.entity.${scriptExt}`],
  migrations: [`${baseDir}/@orm/@migrations/*.${scriptExt}`],

  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',

  cli: {
    migrationsDir: `${baseDir}/@orm/@migrations`,
  },
};

