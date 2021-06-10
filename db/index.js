const { Pool } = require('pg')

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: process.env.DB_MAX,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT
}

const pool = new Pool(config);

module.exports = {
  query: (text, params, callback) => {
    //const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      //console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
}
