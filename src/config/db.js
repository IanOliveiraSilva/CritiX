const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: `postgres://jhhvyfqc:hqnLHXkkN0IvzNVXszxHcjeKJxb2RMfs@silly.db.elephantsql.com/jhhvyfqc`
});
pool.on('connect', () => {
  console.log('Base de Dados conectado com sucesso!');
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};