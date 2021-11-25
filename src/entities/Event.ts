export interface EventOptions {
    name: string
    type: string
}

export abstract class Event {
    public name: string
    public type: string

    protected constructor(
        options: EventOptions
    ) {
        this.name = options.name
        this.type = options.type
    }

    abstract invoke(...payload: any): Promise<any>
}
