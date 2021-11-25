import { ApplicationCommandOptionData, CommandInteraction } from 'discord.js'
import { Client } from './Client'

export interface ModuleOptions {
    name?: string
    description?: string
    permissions?: string[]
    options?: ApplicationCommandOptionData[]
}

export interface ModuleContext {
    interaction: CommandInteraction,
    client: Client
}

export abstract class Module {
    public name: string
    public description: string
    public options: ApplicationCommandOptionData[]
    public permissions?: string[]

    protected constructor(
        options: ModuleOptions
    ) {
        this.name = options.name ?? 'unknow'
        this.description = options.description ?? ''
        this.permissions = options.permissions ?? []
        this.options = options.options ?? []
    }

    abstract execute(context: ModuleContext): Promise<any>
}
