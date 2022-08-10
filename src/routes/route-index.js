const express = require("express");
const path = require("path");

const routes = (app) => {
    app.use(express.static(path.join(__dirname,'..', '..')))    
    app.use(express.static(path.join(__dirname,'..')))
    app.route('/').get((req, res) => {
        res.status(202).sendFile('index.html')
    })
};

module.exports = routes 