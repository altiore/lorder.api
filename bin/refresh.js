const { Client } = require("pg");

require("dotenv").config();

const client = new Client({
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

if (!client || !client.connect) {
  console.log("connection not created", {
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
  });
  process.exit(1);
}

client.connect(err => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  client.query(
    `
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO ${process.env.TYPEORM_USERNAME};
  GRANT ALL ON SCHEMA public TO public;
  COMMENT ON SCHEMA public IS 'standard public schema';
`,
    undefined,
    (err, res) => {
      if (err) {
        err && console.log(`\x1b[33m${err}\x1b[33m`);
        process.exit(1);
      }
      client.end();
    }
  );
});
