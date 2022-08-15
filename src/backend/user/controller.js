const { readUser, createUser, updateUser, readOnly} = require("./service")

async function _get(req, res){
    const jogadorResponse = await readUser();
    res.status(200).json(jogadorResponse);
}

async function _getOnly(req, res){
    const jogadorResponse = await readOnly({'name' : `${req.params.name}`});
    res.status(200).json(jogadorResponse);
}

async function _post(req, res){
    let jogador = await createUser(req.body);
    jogador.save((err) => {
        if(err){
            res.send(`Houve um erro na criação do jogador! Erro:${err.message}`);
        }
        else{
            res.status(201).send('O jogador foi cadastrado com sucesso!');
        }
    })
}

async function _put(req, res){
    const id = req.params.id;

    try {
        updateUser(id, req.body);
        res.status(201).send('A atualização foi feita com sucesso!');
    } catch (error) {
        res.send(`Houve um erro na hora de atualizar o jogador! Erro: ${error}`);
    }
}

module.exports = {
    read : _get,
    post : _post,
    put : _put,
    only: _getOnly
} 