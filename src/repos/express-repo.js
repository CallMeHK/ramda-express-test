const {curry} = require('ramda')

const sendResponse = curry((res, state) => {
  console.log(state)
  res.send(state.response)
  return
})

module.exports = {
  sendResponse,
}
