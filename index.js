const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')

const {getPgTime, authenticateUser, getUserInfo, logOutUser} = require('./src/composed/compose-test')

const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/', (req, res) => res.send(`Hello ${req.body.name}`))

app.get('/time', getPgTime)
app.post('/login', authenticateUser)
app.get('/logout', logOutUser)
app.get('/user', getUserInfo)

app.listen(port, () => console.log(`Server started on port ${port}...`))
