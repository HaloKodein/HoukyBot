import { Interaction } from 'discord.js'
import { Client } from '../entities/Client'
import { Event } from '../entities/Event'

export default class InteractionCreate extends Event {
    constructor() {
        super({ name: 'interactionCreate', type: 'client' })
    }

    async invoke(client: Client, interaction: Interaction) {
        await client.commandService
            .handle(client, interaction)
    }
}
