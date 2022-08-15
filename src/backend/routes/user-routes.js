const { read, post, put, only } = require("../user/controller")
const express = require('express')

const router = express.Router()

router
    .get('/user/:name', only)
    .get('/user', read)
    .post("/user", post)
    .put("/user/:id", put)

module.exports = router 