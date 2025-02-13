const path = require("path")
const { loadCommand } = require("../core/function")

module.exports = (client) => {
    const commandDir = path.join(__dirname, '../commands')
    loadCommand(commandDir, client)
}