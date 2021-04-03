const { Pool } = require('pg')

const config = {
  db: {
    user: '',
    password: '',
    database: '',
    host: '',
    port: '',
    max: '',
    idleTimeoutMillis: '',
  }
};

const dbConfig = {
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
}

const pool = new Pool();

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