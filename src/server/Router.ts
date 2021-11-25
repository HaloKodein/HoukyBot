import { Router } from 'express'
import { join, sep } from 'path'

import { MainController } from './controllers/main/Main'
import { CommandsController } from './controllers/commands/Commands'
import { DashboardController } from './controllers/dashboard/Dashboard'

import { isLogged } from './middlewares/Authenticated'

import passport from 'passport'
import config from '../Config'
import { GuildSettingsController } from './controllers/guild/GuildSettings'
import { MusicboardController } from './controllers/guild/Musicboard'

const router = Router()

const viewsPath = join(`${__dirname}${sep}client${sep}views${sep}`)

router.get('/oauth/login', passport.authenticate('discord'))
router.get(
	'/oauth/redirect',
	passport.authenticate('discord', {
		failureRedirect: '/oauth/error'
	}),
	(request, response) => {
		response.redirect('/')	
	}
)

router.get('/oauth/logout', (request, response) => {
	request.logout()

	response.redirect('/')
})

router.get('/invite', (request, response) => {
	const { invite_type, guild_id, redirect_uri } = request.query

	switch(invite_type) {
		case 'bot':
			const redirect = (guild_id)
				? `${config.inviteBotUrl}&guild_id=${guild_id}&response_type=code&redirect_uri=${encodeURIComponent(`${redirect_uri}`)}`
				: config.inviteBotUrl

			return response.redirect(redirect)
		
		case 'support':
			return response.redirect(config.inviteSupUrl)

		default:
			return response.redirect('/')
	}
})

router.get('/', async(request, response) => {
	const mainController = new MainController(viewsPath)

	await mainController.handleGet({
		request,
		response
	})
})

router.get('/commands', async(request, response) => {
	const commandsController = new CommandsController(viewsPath)

	await commandsController.handleGet({
		request,
		response
	})
})

router.get('/dashboard', isLogged, async(request, response) => {
	const dashboardController = new DashboardController(viewsPath)

	await dashboardController.handleGet({
		request,
		response
	})
})

router.get('/guild/:id/settings', isLogged, async(request, response) => {
	const guildSettingsController = new GuildSettingsController(viewsPath)

	await guildSettingsController.handleGet({
		request,
		response
	})
})

router.post('/guild/:id/settings', isLogged, async(request, response) => {
	const guildSettingsController = new GuildSettingsController(viewsPath)

	await guildSettingsController.handlePost({
		request,
		response
	})
})

router.get('/guild/:id/musicboard', isLogged, async(request, response) => {
	const musicboardController = new MusicboardController(viewsPath)

	await musicboardController.handleGet({
		request,
		response
	})
})

router.post('/guild/:id/musicboard', isLogged, async(request, response) => {
	const musicboardController = new MusicboardController(viewsPath)
})

export default router
