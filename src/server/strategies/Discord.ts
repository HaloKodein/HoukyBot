import { Strategy } from 'passport-discord'
import passport from 'passport'
import config from '../../Config'

passport.serializeUser((user: any, done) => {
	done(null, user)
})

passport.deserializeUser(async (user: any, done) => {
	if (user) done(null, user)
})

export default new Strategy(
	{
		clientID: config.clientId,
		clientSecret: config.clientSecret,
		callbackURL: `${config.serverUrl}/${config.oAuthCallback}`,
		scope: ['identify', 'guilds'],
	},
	async (acessToken, refreshToken, profile, done) => {
		done(null, profile)
	}
)
