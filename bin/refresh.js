const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

client.connect(() => {
  client.query(
    `
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
  COMMENT ON SCHEMA public IS 'standard public schema';
`,
    undefined,
    (err, err2, err3) => {
      err && console.log(`\x1b[33m${err}\x1b[33m`);
      client.end();
    }
  );
});
