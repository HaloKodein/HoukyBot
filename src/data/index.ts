import { connect } from 'mongoose'
import config from '../Config'

export async function databaseBootstrap() {
    connect(config.databaseUri)
        .then(() => console.log('Database ready'))
        .catch(err => console.error(err))
}
