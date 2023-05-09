const express = require('express')
const cors = require('cors')
const config = require('config')
const user = require('../src/routes/user')
const auth = require('../src/routes/auth')
const knexConfig = require('../src/knexfile')


console.log(process.env.NODE_ENV)
if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR - JWTPrivateKey not define')
    process.exit(1)
}
const app = express()

knexConfig
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', user)
app.use('/api/signin', auth)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})