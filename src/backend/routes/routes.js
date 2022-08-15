const userRoutes = require("./user-routes")

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(202).send('Tela inicial. Olá ;D')
    })

    app.use(
        userRoutes
    );
};

module.exports = routes 