require("dotenv").config();

module.exports = {
  type: process.env.TYPEORM_CONNECTION || "postgres",

  host: process.env.TYPEORM_HOST || "localhost",
  port: process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  entities: [process.env.TYPEORM_ENTITIES || "src/@orm/**/**.entity.ts"],
  migrations: [process.env.TYPEORM_MIGRATIONS || "src/@orm/@migrations/**.ts"],

  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === "true",

  cli: {
    entitiesDir: "src/@orm",
    migrationsDir: "src/@orm/@migrations",
  },
};
