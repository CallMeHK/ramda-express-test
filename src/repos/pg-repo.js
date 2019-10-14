const {curry} = require('ramda')

const {config} = require('../config')

const getPool = state => ({
  ...state,
  pool: config.pg.pgPool,
})

const makePgQuery = curry(async (name, query, state) => {
  const {pool} = state
  const pgQueryResult = await pool.query(query)
  return {
    ...state,
    [name]: pgQueryResult,
  }
})

const queryFromState = async state => {
  const {pool, query} = state
  const pgQueryResult = await pool.query(query.queryString)
  return {
    ...state,
    [query.name]: pgQueryResult,
  }
}

module.exports = {
  getPool,
  makePgQuery,
  queryFromState,
}
