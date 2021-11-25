import { Client } from '../entities/Client'
import { Event } from '../entities/Event'
import config from '../Config'

export default class Ready extends Event {
    constructor() {
        super({ name: 'ready', type: 'client' })
    }

    async invoke(client: Client) {
        await client.application?.commands
            .set([
                ...client.commandService.commandsArray,
                ...client.moduleService.modulesArray
            ])

        client?.user?.setActivity({
            name: 'Musics for you.',
            type: 'STREAMING',
            url: 'https://www.twitch.tv/houky'
        })

        console.log(`Ready in ${client?.user?.username}`)
    }
}
