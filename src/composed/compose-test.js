const {pipe, curry} = require('ramda')

const {getPool, makePgQuery, queryFromState} = require('../repos/pg-repo')
const {sendResponse} = require('../repos/express-repo')
const {
  signJwt,
  comparePassword,
  getToken,
  verifyJwt,
} = require('../repos/jwt-repo')

const then = curry((fn, prom) =>
  prom.then(fn).catch(e => {
    throw new Error(e.message)
  }),
)

const formatPgTimeResponse = state => {
  return {...state, response: state.pgTime.rows[0]}
}

const getPgTime = (req, res) => {
  const composed = pipe(
    getPool,
    makePgQuery('pgTime', 'SELECT NOW()'),
    then(formatPgTimeResponse),
    then(sendResponse(res)),
  )
  try {
    composed({})
  } catch (e) {
    res.send(e)
  }
}

const prepareRequest = curry((req, state) => {
  const {user, password} = req.body
  const creds = {user, password}
  return {
    ...state,
    creds,
  }
})

const prepareAuthQuery = state => {
  const {creds} = state
  return {
    ...state,
    query: {
      name: 'getUser',
      queryString: `SELECT * FROM users WHERE name='${creds.user}'`,
    },
  }
}

const prepareAuthResponse = state => {
  console.log('prepareAuthResponse:', state)
  return {
    ...state,
    response: {
      success: true,
    },
  }
}

const setCookie = curry((res, state) => {
  console.log(state.token)
  res.cookie('token', state.token)
  return {
    ...state,
  }
})

const authenticateUser = async (req, res) => {
  const composed = pipe(
    prepareRequest(req),
    prepareAuthQuery,
    getPool,
    queryFromState,
    then(comparePassword),
    then(signJwt),
    then(setCookie(res)),
    then(prepareAuthResponse),
    then(sendResponse(res)),
  )
  try {
    await composed({})
  } catch (e) {
    console.log(e)
    res.status(401)
    res.send({error: e.message})
  }
}

const prepGetUserInfoResponse = state => {
  return {...state, response: state.decodedToken}
}

const getUserInfo = async (req, res) => {
  const composed = pipe(
    getToken(req),
    verifyJwt,
    prepGetUserInfoResponse,
    sendResponse(res),
  )
  try {
    composed({})
  } catch (e) {
    console.log(e)
    res.status(401)
    res.send({error: e.message})
  }
}

const setNullToken = state => {
  return {
    ...state,
    token: 'null',
  }
}

const prepareLogOutUserResponse = state => {
  return {
    ...state,
    response: {
      success: true,
    },
  }
}

const logOutUser = (req, res) => {
  const composed = pipe(
    setNullToken,
    setCookie(res),
    prepareLogOutUserResponse,
    sendResponse(res),
  )
  try {
    composed({})
  } catch (e) {
    res.status(400)
    res.send({message: e.message})
  }
}

module.exports = {
  then,
  getPgTime,
  authenticateUser,
  getUserInfo,
  logOutUser,
}
