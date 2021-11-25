import { Queue } from 'distube'
import { client } from '../../..'
import { HandleContext } from '../../../interfaces/Server'

export class MusicboardController {
    constructor(
        private viewsPath: string
    ) {}

    async handleGet({ response, request }: HandleContext) {
        const queue = client.distube
            .getQueue(request.params.id) as Queue

        const guild = client.guilds.cache
            .get(request.params.id)

        response.render(`${this.viewsPath}Musicboard.ejs`, {
            pageTitle: 'Musicboard - HoukyBot.',
            botName: 'Houky',
            bot: client,
            queue: queue,
            guild: guild,
            user: request.user ? request.user : null,
            logged: request.user ? true : false
        })
    }
}
