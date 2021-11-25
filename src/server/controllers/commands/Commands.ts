import { client } from '../../..'
import { HandleContext } from '../../../interfaces/Server'

export class CommandsController {
    constructor(
        private viewsPath: string
    ) {}

    async handleGet({ response, request }: HandleContext) {
        response.render(`${this.viewsPath}Commands.ejs`, {
            pageTitle: 'Commands - HoukyBot.',
            botName: 'Houky',
            bot: client,
            user: request.user ? request.user : null,
            moduleArray: client.moduleService.modulesArray,
            logged: request.user ? true : false
        })
    }
}
