const repository = require("./repository")

const readUser = async () => {
    return repository.userGet();
}

const readOnly = async (name) => {
    return repository.onlyGet(name)
}

const updateUser = async (id, content) => {
    return repository.userPut(id, content);
}

const createUser = async(body) => {
    return repository.userPost(body);
}

module.exports = {
    readUser,
    updateUser,
    createUser,
    readOnly
} 