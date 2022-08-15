const express = require("express")
var cors = require('cors')
const db = require("./dbConfig.js")
const routes = require("./routes/routes.js")

db.on("error", console.log.bind(console, 'Houve algum erro na hora de se conectar ao banco!'));
db.once("open", () => {
    console.log('Conexão feita com êxito!')
})

const app = express()
app.use(express.json())
app.use(cors()) 
routes(app)

module.exports = app 