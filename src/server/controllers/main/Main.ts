import { client } from '../../..'
import { HandleContext } from '../../../interfaces/Server'

export class MainController {
    constructor(
        private viewsPath: string
    ) {}

    async handleGet({ response, request }: HandleContext) {
        response.render(`${this.viewsPath}Main.ejs`, {
            pageTitle: 'Home - HoukyBot.',
            botName: 'Houky',
            bot: client,
            user: request.user ? request.user : null,
            logged: request.user ? true : false
        })
    }
}
