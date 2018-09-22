const { Client } = require("pg");

require("dotenv").config();

console.log("before create Client");
const client = new Client({
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  user: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
console.log("after create Client");

if (!client || !client.connect) {
  process.exit(1);
}

client.connect(err => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("after connection");
  client.query(
    `
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
  COMMENT ON SCHEMA public IS 'standard public schema';
`,
    undefined,
    (err, res) => {
      if (err) {
        err && console.log(`\x1b[33m${err}\x1b[33m`);
        process.exit(1);
      }
      console.log("result of query is", res);
      client.end();
    }
  );
});
