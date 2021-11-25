import { readdir } from 'fs/promises'
import { Client } from '../../entities/Client'
import { Event } from '../../entities/Event'

export class EventService {
    constructor(
        private client: Client
    ) {}

    public events = new Map<string, Event>()

    public async initialize(): Promise<any> {
        const handlerPath = `${process.cwd()}/src/events/`
        const handlers = await readdir(handlerPath)

        for (const handler of handlers) {
            const { default: Event } = await import(handlerPath + handler)
            const event = new Event() as Event

            this.events
                .set(event.name, event)

            await this
                .handle(event)
        }
    }

    public async handle(event: Event): Promise<any> {
        const client = this.client

        switch (event.type) {
            case 'client':
                client.on(
                    event.name,
                    event.invoke
                        .bind(null, client)
                )
            break
            case 'distube':
                client.distube.on(
                    event.name as any,
                    event.invoke
                        .bind(null, this.client)
                )
            break
        }
    }
}
