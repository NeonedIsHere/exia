const { existsSync, readdirSync } = require("fs")
const path = require("path")

module.exports = (client) => {

    const categories = [
        { name: 'buttons', collection: client.buttons },
        { name: 'modals', collection: client.modals },
        { name: 'selects', collection: client.selects }
    ]

    for (const category of categories) {
        const interactionPath = path.join(__dirname, '../interaction', category.name)
        if (!existsSync(interactionPath)) {
            console.log(`[❌] » [${category.name}] Directory not found. Skipping...`)
            continue
        }

        const files = readdirSync(interactionPath).filter(file => file.endsWith('.js'))

        for (const file of files) {
            const interaction = require(`${interactionPath}/${file}`)
            if (!interaction || !interaction.customId || !interaction.execute) {
                console.error(`[⚠️] » [${category.name}] Invalid interaction found in ${file}. Skipping...`)
                continue
            }

            categories.collection.set(interaction.customId, interaction)
            console.log(`[✅] » [${category.name}] Interaction ${interaction.customId} loaded successfully`)
        }
    }
}