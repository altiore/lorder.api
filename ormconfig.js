const baseDir = process.env.BASE_DIR || 'dist';

module.exports = {
  type: 'postgres',

  host: process.env.TYPEORM_HOST || 'localhost',
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [`${baseDir}/@orm/entities/*.entity{.ts,.js}`],
  migrations: [`${baseDir}/@orm/@migrations/*{.ts,.js}`],

  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',

  cli: {
    migrationsDir: `${baseDir}/@orm/@migrations`,
  },
};
