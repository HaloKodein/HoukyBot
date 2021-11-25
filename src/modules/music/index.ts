import { verify } from 'crypto'
import { MessageEmbed, TextChannel } from 'discord.js'
import { Queue } from 'distube'
import { Module, ModuleContext } from '../../entities/Module'

export default class Music extends Module {
    constructor() {
        super({
            name: 'music',
            description: 'Sistema de música.',
            options: [
                {
                    name: 'play',
                    description: 'Toque uma música.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'song',
                            description: 'musica ou url.',
                            type: 'STRING',
                            required: true
                        }
                    ]
                },
                {
                    name: 'volume',
                    description: 'Modifique o volume da música',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'percent',
                            description: 'porcentagem do volume.',
                            type: 'NUMBER',
                            required: true
                        }
                    ]
                },
                {
                    name: 'jump',
                    description: 'Pule para outra música na fila.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'jump',
                            description: 'posição da música que deseja pular.',
                            type: 'NUMBER',
                            required: true
                        }
                    ]
                },
                {
                    name: 'filter',
                    description: 'Escolha um filtro para a música.',
                    type:  'SUB_COMMAND',
                    options: [
                        {
                            name: 'filter',
                            description: 'escolha o filtro.',
                            type: 'STRING',
                            choices: [
                                { name: '3d', value: '3d' },
                                { name: 'bassboost', value: 'bassboost' },
                                { name: 'vaporwave', value: 'vaporwave' },
                                { name: 'reverse', value: 'reverse' },
                                { name: 'nightcore', value: 'nightcore' },
                                { name: 'karaoke', value: 'karaoke' },
                                { name: 'nenhum', value: 'nenhum' }
                            ]
                        }
                    ]
                },
                {
                    name: 'settings',
                    description: 'Opções para controlar as músicas.',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'options',
                            description: 'selecione uma opção.',
                            type: 'STRING',
                            choices: [
                                { name: 'stop', value: 'stop' },
                                { name: 'pause', value: 'pause' },
                                { name: 'resume', value: 'resume' },
                                { name: 'queue', value: 'queue' },
                                { name: 'skip', value: 'skip' },
                                { name: 'loop', value: 'loop' },
                                { name: 'nowplaying', value: 'nowplaying' },
                                { name: 'loopqueue', value: 'loopqueue' }
                            ]
                        }
                    ]
                }
            ]
        })
    }

    async execute({ client, interaction }: ModuleContext) {
        const { options, guild } = interaction

        const member = guild?.members.cache
            .get(interaction.user.id)
        
        const textChannel = interaction.channel as TextChannel
        const voiceChannel = member?.voice.channel

        const distube = client.distube
        const target = options.getString('song')

        const globalEmbed = new MessageEmbed()
            .setDescription('Você precisa estar em um canal de voz para usar os comandos de musica.')
            .setColor(0x3e0387)

        if (!voiceChannel)
            return await interaction.followUp({
                embeds: [globalEmbed],
                ephemeral: true
            })

        globalEmbed.setDescription('Eu ja estou em um canal de voz.')

        if (guild?.me?.voice.channelId && voiceChannel.id !== guild?.me?.voice.channelId)
            return await interaction.followUp({
                embeds: [globalEmbed],
                ephemeral: true
            })

        globalEmbed.setDescription('Não há músicas na fila.')

        async function verifyQueue(queue: Queue) {
            if (!queue)
                return await interaction.followUp({
                    embeds: [globalEmbed],
                    ephemeral: true
                })
        }

        try {
            switch(interaction.options.getSubcommand()) {
                case 'play': {
                    await distube
                        .playVoiceChannel(
                            voiceChannel,
                            target,
                            {
                                textChannel,
                                member
                            }
                        )

                    return await interaction.deleteReply()
                }
                case 'settings': {
                    const queue = distube
                        .getQueue(interaction.guildId) as Queue

                    await verifyQueue(queue)

                    switch(options.getString('options')) {
                        case 'stop': {
                            await queue.stop()

                            globalEmbed.setDescription('Música parada com sucesso.')

                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'pause': {
                            globalEmbed.setDescription('Á música ja foi pausada.')

                            if (queue.paused)
                                return await interaction.followUp({
                                    embeds: [globalEmbed],
                                    ephemeral: true
                                })

                            queue.pause()

                            globalEmbed.setDescription('Música pausada com sucesso.')

                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'resume': {
                            globalEmbed.setDescription('Á música não esta pausada.')

                            if (!queue.paused)
                                return await interaction.followUp({
                                    embeds: [globalEmbed],
                                    ephemeral: true
                                })

                            queue.resume()

                            globalEmbed.setDescription('Música resumida com sucesso.')

                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'skip': {
                            await verifyQueue(queue)

                            await queue.skip()

                            globalEmbed.setDescription('Não há músicas na fila.')

                            if (!queue.songs[0])
                                return await interaction.followUp({
                                    embeds: [globalEmbed]
                                })

                            globalEmbed.setDescription('Música resumida com sucesso.')
                            
                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'loop': {
                            await verifyQueue(queue)

                            const repeatMode = (queue.repeatMode === 0)
                                ? queue.repeatMode = 1
                                : queue.repeatMode = 0

                            globalEmbed.setDescription(`O loop foi ${(queue.repeatMode === 0) ? 'desativado' : 'ativado'} na música atual.`)

                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'loopqueue': {
                            await verifyQueue(queue)

                            const repeatMode = (queue.repeatMode === 0 || queue.repeatMode === 1)
                                ? queue.repeatMode = 2
                                : queue.repeatMode = 0

                            globalEmbed.setDescription(`O loop foi ${(queue.repeatMode === 0) ? 'desativado' : 'ativado'} na fila atual.`)
                            
                            return await interaction.followUp({
                                embeds: [globalEmbed]
                            })
                        }
                        case 'queue': {
                            await verifyQueue(queue)

                            const queueArray = queue.songs.slice(0, 10)

                            const queueEmbed = new MessageEmbed()
                                .setDescription(`**Lista de Músicas**\n\n${queueArray.map(e => `**${queue.songs.indexOf(e)+1}** - \`${e.name}\``).join('\n')}`)
                                .setThumbnail(interaction.guild?.iconURL({ dynamic: true }) as string)
                                .setTimestamp()
                                .setColor(0x3e0387)

                            return await interaction.followUp({
                                embeds: [queueEmbed]
                            })
                        }
                        case 'nowplaying': {
                            await verifyQueue(queue)

                            const song = queue.songs[0]

                            const size = 15
                            const textProgress = '▭'
                                .repeat(Math.round(size * queue.currentTime) / song.duration)
                                .replace(/.$/, '●')
                            
                            const emptyProgress = '▭'
                                .repeat(size - (Math.round(size * queue.currentTime) / song.duration))

                            const progressBar = textProgress + emptyProgress

                            const nowPlayingEmbed = new MessageEmbed()
                                .setDescription(`**Tocando agora** \`${song.name}\`\n\n**Tempo** ${progressBar}\`[${queue.formattedCurrentTime} / ${song.formattedDuration}]\``)
                                .setThumbnail(song.thumbnail as string)
                                .setFooter(`Requisitado por ${interaction.user?.username}`, interaction.user?.displayAvatarURL({ dynamic: true }))
                                .setColor(0x3e0387)

                            return await interaction.followUp({
                                embeds: [nowPlayingEmbed]
                            })
                        }
                    }
                }
                case 'volume': {
                    const queue = distube.getQueue(interaction.guildId) as Queue
                    const percent = options.getNumber('percent') as number

                    await verifyQueue(queue)

                    globalEmbed.setDescription('Escolha uma porcentagem entre 0 e 100.')

                    if (percent < 0 || percent > 100)
                        return await interaction.followUp({
                            embeds: [globalEmbed]
                        })

                    queue.setVolume(percent)

                    globalEmbed.setDescription(`Volume setado para \`${percent}%\``)

                    return await interaction.followUp({
                        embeds: [globalEmbed]
                    })
                }
                case 'jump': {
                    const queue = distube.getQueue(interaction.guildId) as Queue
                    const jump = options.getNumber('jump') as number

                    await verifyQueue(queue)

                    globalEmbed.setDescription('Por favor, escolha uma posição válida.')

                    if (jump < queue.songs.length || jump > queue.songs.length)
                        return await interaction.followUp({
                            embeds: [globalEmbed]
                        })

                    await queue
                        .jump(jump)

                    globalEmbed.setDescription(`Pulando para posição ${jump}.`)

                    return await interaction.followUp({
                        embeds: [globalEmbed]
                    })
                }
                case 'filter': {
                    const queue = distube.getQueue(interaction.guildId) as Queue
                    const filter = options.getString('filter') as string

                    await verifyQueue(queue)

                    ;(filter === 'nenhum')
                        ? queue.setFilter(false, true)
                        : queue.setFilter(filter, true)

                    globalEmbed.setDescription(`Filtro ${filter} aplicado com sucesso.`)

                    return await interaction.followUp({
                        embeds: [globalEmbed]
                    })
                }
            }
        } catch (err) {
            return console.error(err)
        }
    }
}
