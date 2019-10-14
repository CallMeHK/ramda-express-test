const jwt = require('jsonwebtoken')

const {config} = require('../config')
const bcrypt = {
  compare: () => {
    return Promise.resolve(false)
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
}
