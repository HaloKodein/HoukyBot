import { Client } from './entities/Client'
import config from './Config'

export const client = new Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_VOICE_STATES',
        'GUILD_MESSAGES',
        'DIRECT_MESSAGES'
    ],
    partials: [
        'CHANNEL',
        'GUILD_MEMBER',
        'MESSAGE',
        'USER'
    ]
})

async function bootstrap() {
    await client
        .login(config.token)
}

;(async () =>
    await bootstrap()
)()
