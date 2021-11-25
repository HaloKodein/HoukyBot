import { v4 } from 'uuid'
import { renderFile } from 'ejs'
import { resolve, sep } from 'path'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { Client } from '../entities/Client'

import DiscordStrategy from './strategies/Discord'
import express from 'express'
import store from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '../Config'
import routes from './Router'

const app = express()
const http = createServer(app)
const io = new Server(http)

export async function serverBootstrap(client: Client) {
	passport.use(DiscordStrategy)

	app.use(express.static(resolve(`${__dirname}${sep}client${sep}`)))

	app.use(morgan('dev'))

	app.use(express.json())

	app.use(
		session({
			secret: 'kGWheOgakg2)Gk29a@9gt2k0-gf@ggsa',
			name: 'discord',
			saveUninitialized: false,
			resave: false,
			genid: () => {
				return v4().replace(/-/g, '')
			},
			cookie: {
				maxAge: 60000 * 60 * 24,
			},
			store: store.create({
				mongoUrl: config.databaseUri,
				dbName: 'session',
			}),
		})
	)

	app.use(passport.initialize())
	app.use(passport.session())

	app.use(helmet({
		contentSecurityPolicy: false
	}))

	app.engine('html', renderFile)
	app.set('view engine', 'html')

	app.use(routes)

	io.on('connection', socket => {
		console.log(socket.id)
	})

	client.distube
		.on('addSong', (_, song) => {
			console.log('Apareceu sim poha tmnc')
			io.emit('song_added', song)
		})

	client.distube
		.on('playSong', (_, song) => {
			console.log('Apareceu sim poha tmnc')
			io.emit('song_playing', song)
		})

	http.listen(3000, () => console.log('Server ready'))
}
