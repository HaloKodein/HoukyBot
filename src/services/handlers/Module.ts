import { Interaction } from 'discord.js'
import { readdir } from 'fs/promises'
import { Client } from '../../entities/Client'
import { Module } from '../../entities/Module'

export class ModuleService {
    constructor(
    ) {}

    public modules = new Map<string, Module>()
    public modulesArray = new Array<Omit<Module, 'execute'>>()

    public async initialize() {
        const repositoryPath = `${process.cwd()}/src/modules/`
        const repositories = await readdir(repositoryPath)

        for (const repository of repositories) {
            const handlerPath = repositoryPath + repository
            const handlers = await readdir(handlerPath)

            for (const handler of handlers) {
                const { default: Module } = await import(handlerPath + `/${handler}`)
                const module = new Module() as Module

                this.modules
                    .set(repository, module)

                this.modulesArray
                    .push({
                        name: module.name,
                        description: module.description,
                        options: module.options
                    })
            }
        }
    }

    public async handle(client: Client, interaction: Interaction) {
        if (!interaction.isCommand()) return

        const target = interaction.commandName
        const module = this.modules.get(target)

        if (!module) return

        try {
            await module
                .execute({ client, interaction })
        } catch (err) {
            return
        }
    }
}
