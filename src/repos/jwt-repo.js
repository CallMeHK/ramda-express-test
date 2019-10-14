const jwt = require('jsonwebtoken')
const ck = require('cookie')
const {curry} = require('ramda')

const {config} = require('../config')
const bcrypt = {
  compare: () => {
    return Promise.resolve(true)
  },
}

const signJwt = state => {
  const {secret} = config.jwt
  const {id, name} = state.getUser.rows[0]

  const token = jwt.sign({id, name}, secret)

  return {
    ...state,
    token,
  }
}

const getToken = curry((req, state) => {
  const {cookie} = req.headers
  console.log('cookie', cookie)
  let token
  try {
    token = ck.parse(cookie).token
  } catch (e) {
    // do nothing
  }
  console.log('token:', token)
  return {
    ...state,
    token,
  }
})

const verifyJwt = state => {
  const {secret} = config.jwt
  const {token} = state
  if (!token) {
    throw new Error('No auth token found')
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, secret)
  } catch (e) {
    throw new Error(e.message)
  }
  return {
    ...state,
    decodedToken,
  }
}

const comparePassword = async state => {
  const {password} = state.creds
  const {password: hashedPassword} = state.getUser.rows[0]
  const verifyPassword = await bcrypt.compare(password, hashedPassword)

  if (!verifyPassword) {
    throw new Error('Could not validate password')
  }
  return {
    ...state,
  }
}

module.exports = {
  signJwt,
  comparePassword,
  getToken,
  verifyJwt,
}
