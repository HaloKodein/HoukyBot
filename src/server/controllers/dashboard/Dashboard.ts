import { Permissions } from 'discord.js'
import { client } from '../../..'
import { HandleContext, User } from '../../../interfaces/Server'

export class DashboardController {
    constructor(
        private viewsPath: string
    ) {}

    async handleGet({ response, request }: HandleContext) {
        response.render(`${this.viewsPath}Dashboard.ejs`, {
            pageTitle: 'Dashboard - HoukyBot.',
            botName: 'Houky',
            bot: client,
            Permissions,
            user: request.user ? request.user : null,
            logged: request.user ? true : false
        })
    }
}
