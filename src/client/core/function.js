const { readdirSync, statSync } = require("fs");
const path = require("path");


/**
 * 
 * @param {Object} builder
 * @param {Object} options
 */

function addOptions(builder, options) {
    options.forEach(option => {
        switch (option.type.toLowerCase()) {
            case 'string':
                builder.addStringOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                        .setAutocomplete(option.autocomplete ?? false)
                        .addChoices(option.choices?.map(choice => ({
                            name: choice.name,
                            value: choice.value
                        })) ?? [])
                );
                break;
            case 'integer':
                builder.addIntegerOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'boolean':
                builder.addBooleanOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'user':
                builder.addUserOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'channel':
                builder.addChannelOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'role':
                builder.addRoleOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'mentionable':
                builder.addMentionableOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'attachment':
                builder.addAttachmentOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            case 'number':
                builder.addNumberOption(opt =>
                    opt.setName(option.name)
                        .setDescription(option.description ?? '')
                        .setRequired(option.required ?? false)
                );
                break;
            default:
                throw new Error(`Type d'option "${option.type}" non supporté pour l'option "${option.name}".`);
        }
    });
}

/**
 * 
 * @param {Object} command 
 * @returns {SlashCommandBuilder} 
 */

function buildCommand(command) {
    const slashCommand = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm ?? false)
        .setDefaultMemberPermissions(command.permissions === 'Aucune' ? null : command.permissions);

    if (command.options?.length > 0) {
        command.options.forEach(option => {
            if (option.type.toLowerCase() === 'subcommand') {
                slashCommand.addSubcommand(sub => {
                    sub.setName(option.name).setDescription(option.description ?? 'Aucune description.');
                    if (option.options?.length) {
                        addOptions(sub, option.options);
                    }
                    return sub; 
                });
            } else if (option.type.toLowerCase() === 'subcommandgroup') {
                slashCommand.addSubcommandGroup(group => {
                    group.setName(option.name).setDescription(option.description ?? 'Aucune description.');
                    if (option.options?.length) {
                        option.options.forEach(subcommand => {
                            group.addSubcommand(sub => {
                                sub.setName(subcommand.name).setDescription(subcommand.description ?? 'Aucune description.');
                                if (subcommand.options?.length) {
                                    addOptions(sub, subcommand.options);
                                }
                                return sub; 
                            });
                        });
                    }
                    return group;
                });
            } else {
                addOptions(slashCommand, [option]);
            }
        });
    }

    return slashCommand.toJSON();
}

/**
 * @param {String} dir
 * @param {Object} client
 */
function loadCommand (dir, client) {
    const files = readdirSync(dir)

    for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            loadCommand(fullPath, client)
        } else if (file.endsWith(".js")) {
            const command = require(fullPath)

            if (!command.name) {
                console.error(`[❌] » [Commands] Command ${fullPath} does not have a name property, Skipping...`)
                continue
            }

            client.commands.set(command.name, command)
            console.log(`[✅] » [Commands] Loaded command ${command.name} from ${file}`)
        }
    }
}

function loadEvent(dir, client) {
    const files = readdirSync(dir)

    for (const file of files) {
        const fullPath = path.join(dir, file)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
            loadEvent(fullPath, client)
        } else if (file.endsWith(".js")) {
            const event = require(fullPath)

            if (!event.name) {
                console.error(`[❌] » [Events] Event ${fullPath} does not have a name property, Skipping...`)
                continue
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args))
            } else {
                client.on(event.name, (...args) => event.execute(...args))
            }

            client.events.set(event.name, event)
            console.log(`[✅] » [Events] Loaded event ${event.name} from ${file}`)
        }
    }
}

module.exports = {
    buildCommand,
    loadCommand,
    loadEvent
};