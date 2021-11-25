import { Interaction } from 'discord.js'
import { readdir } from 'fs/promises'
import { Client } from '../../entities/Client'
import { Command } from '../../entities/Command'

export class CommandService {
    constructor(
    ) {}

    public commands = new Map<string, Command>()
    public commandsArray = new Array<Omit<Command, 'execute'>>()

    public async initialize() {
        const repositoryPath = `${process.cwd()}/src/commands/`
        const repositories = await readdir(repositoryPath)

        for (const repository of repositories) {
            const handlerPath = repositoryPath + repository
            const handlers = await readdir(handlerPath)

            for (const handler of handlers) {
                const { default: Command } = await import(handlerPath + `/${handler}`)
                const command = new Command() as Command

                this.commands
                    .set(command.name, command)

                this.commandsArray
                    .push({
                        name: command.name,
                        description: command.description,
                        options: command.options
                    })
            }
        }
    }

    public async handle(client: Client, interaction: Interaction) {
        if (!interaction.isCommand()) return

        const target = interaction.commandName
        const command = this.commands.get(target)

        await interaction
            .deferReply()

        if (!command)
            return await client.moduleService
                .handle(client, interaction)

        try {
            await command
                .execute({ client, interaction })
        } catch (err) {
            return
        }
    }
}
