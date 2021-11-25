import { Client as DiscordClient, ClientOptions, TextChannel } from 'discord.js'
import { DisTube } from 'distube'
import { SpotifyPlugin } from  '@distube/spotify'
import { CommandService } from '../services/handlers/Command'
import { EventService } from '../services/handlers/Event'
import { ModuleService } from '../services/handlers/Module'
import { EventEmitter } from 'events'
import { serverBootstrap } from '../server/App'
import { databaseBootstrap } from '../data'

export class Client extends DiscordClient {
    constructor(
        options: ClientOptions
    ) {
        super(options)

        this.distube
            .setMaxListeners(2)
    }

    public distube = new DisTube(this, {
        leaveOnFinish: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        plugins: [new SpotifyPlugin()]
    })

    public globalListener = new EventEmitter()

    public commandService = new CommandService()
    public moduleService = new ModuleService()
    public eventService = new EventService(this)

    public async login(token: string) {
        await this.moduleService
            .initialize()

        await this.commandService
            .initialize()

        const login = await super
            .login(token)

        await this.eventService
            .initialize()

        await databaseBootstrap()

        await serverBootstrap(this)

        return login
    }
}
