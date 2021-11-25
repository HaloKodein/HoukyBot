import { NextFunction, Request, Response } from 'express'
import { User } from '../../interfaces/Server'
import config from '../../Config'

export function isOwner(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User

    if (user.id !== config.ownerId)
        return res.redirect('/')
    
    next()
}

export function isLogged(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User

    if (user && user.id)
        return next()

    return res.redirect('/oauth/login')
}
