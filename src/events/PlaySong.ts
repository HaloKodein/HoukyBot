import { MessageEmbed } from 'discord.js'
import { Queue, Song } from 'distube'
import { Client } from '../entities/Client'
import { Event } from '../entities/Event'
import { io } from '../server/App'

export default class PlaySong extends Event {
    constructor() {
        super({ name: 'playSong', type: 'distube' })
    }

    async invoke(client: Client, queue: Queue, song: Song) {
        const songEmbed = new MessageEmbed()
            .setDescription(`**Tocando** \`${song.name}\``)
            .setColor(0x3e0387)

        await queue.textChannel?.send({
            embeds: [songEmbed]
        })
    }
}
