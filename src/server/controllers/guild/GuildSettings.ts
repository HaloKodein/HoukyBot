import { Permissions } from 'discord.js'
import { client } from '../../..'
import { HandleContext, User } from '../../../interfaces/Server'

export class GuildSettingsController {
    constructor(
        private viewsPath: string
    ) {}

    async handleGet({ response, request }: HandleContext) {
        const user = request.user as User
        const guild = await client.guilds.fetch(String(request.params.id))
        
        if (!guild)
            return response.redirect('/')
        
        const member = await guild.members.fetch(user.id)

        if (!member)
            return response.redirect('/')

        if (!member.permissions.has('MANAGE_GUILD'))
            return response.redirect('/')

        response.render(`${this.viewsPath}GuildSettings.ejs`, {
            pageTitle: `Guild - ${guild.name}`,
            botName: 'Houky',
            bot: client,
            Permissions,
            guild,
            user: request.user ? request.user : null,
            logged: request.user ? true : false
        })
    }

    async handlePost({ request, response }: HandleContext) {
        const { dj_role, bot_name } = request.body

        if (!bot_name || !dj_role)
            return response
                .status(200)
                .send()

        const guild = client.guilds.cache.get(request.params.id)

        await guild?.members.cache.get(client?.user?.id as string)
            ?.setNickname(bot_name)

        response
            .status(200)
            .send()
    }
}
