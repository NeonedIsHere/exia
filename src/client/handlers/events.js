const path = require("path")
const { loadEvent } = require("../core/function")

module.exports = (client) => {
    const eventDir = path.join(__dirname, '../events')
    loadEvent(eventDir, client)
}