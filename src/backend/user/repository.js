const users = require("./model")

const userGet = async () => {
    return users.find().lean()
}

const onlyGet = async (name) => {
    return users.find(name).lean()
}

const userPut = async (id, content) => {
    return users.findByIdAndUpdate(id, {$set: content})
}

const userPost = async (body) => {
    return new users(body)
}

module.exports = {
    userGet,
    userPut,
    userPost,
    onlyGet
}