require('dotenv').config()
const app = require('./src/backend/app.js');

const port = process.env.PORTDB;

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${process.env.PORTDB}!`)
})