const chatGPT = require('./chatGPT.controllers')

const chatGPTResolver = async (_, { input, history }) => {
  return chatGPT(input, history)
}

module.exports = {
  Query: {
    chatGPT: chatGPTResolver,
  },
}
