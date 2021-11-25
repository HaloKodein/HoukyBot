import { MessageEmbed } from 'discord.js'
import { Queue, Song } from 'distube'
import { Client } from '../entities/Client'
import { Event } from '../entities/Event'
import { io } from '../server/App'

export default class AddSong extends Event {
    constructor() {
        super({ name: 'addSong', type: 'distube' })
    }

    async invoke(client: Client, queue: Queue, song: Song) {
        const songEmbed = new MessageEmbed()
            .setDescription(`**Adicionado na fila** \`${song.name}\``)
            .addField('Duração', `\`${song.formattedDuration}\``, true)
            .addField('Likes', `\`${song.likes}\``, true)
            .addField('Dislikes', `\`${song.dislikes}\``, true)
            .setThumbnail(song.thumbnail as string)
            .setFooter(`Requisitado por ${song.user?.username}`, song.user?.displayAvatarURL({ dynamic: true }))
            .setColor(0x3e0387)

        await queue.textChannel?.send({
            embeds: [songEmbed]
        })
    }
}
