import { NextFunction, Request, Response } from 'express'

export interface User {
    id: string,
    username: string,
    avatar: string,
    discriminator: string,
    public_flags: number,
    flags: number,
    banner: string | null,
    banner_color: string | null,
    accent_color: number,
    locale: string,
    mfa_enabled: boolean,
    provider: string,
    accessToken: string,
    guilds: Guild[]
}

export interface Guild {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: number,
    features: any[],
    permissions_new: string
}

export interface HandleContext {
    request: Request,
    response: Response,
    next?: NextFunction
}
