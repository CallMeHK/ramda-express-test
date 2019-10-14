const pg = require('pg')

const config = {
  pg: {
    connectionString: process.env.POSTGRES_URL,
    pgPool: new pg.Pool({connectionString: process.env.POSTGRES_URL}),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
}

module.exports = {
  config,
}
