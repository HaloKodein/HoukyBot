import { ApplicationCommandOptionData, CommandInteraction } from 'discord.js'
import { Client } from './Client'

export interface CommandOptions {
    name?: string
    description?: string
    permissions?: string[]
    options?: ApplicationCommandOptionData[]
}

export interface CommandContext {
    interaction: CommandInteraction,
    client: Client
}

export abstract class Command {
    public name: string
    public description: string
    public options: ApplicationCommandOptionData[]
    public permissions?: string[]

    protected constructor(
        options: CommandOptions
    ) {
        this.name = options.name ?? 'unknow'
        this.description = options.description ?? ''
        this.permissions = options.permissions ?? []
        this.options = options.options ?? []
    }

    abstract execute(context: CommandContext): Promise<any>
}
