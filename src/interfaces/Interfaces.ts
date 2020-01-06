export enum AddressFamily {
    IPV4 = 4,
    IPV6 = 6,
}

export default interface Address {
    ip: string,
    port: number,
    family: AddressFamily
}

export enum Difficulty {
    Peaceful = 0,
    Easy = 1,
    Normal = 2,
    Hard = 3,
}

export enum Dimension {
    Overworld = 0,
    Nether = 1,
    End = 2,
}

export enum Edition {
    Vanilla = 0,
    Edu = 1,
}

export enum Gamemode {
    Surivival = 0,
    Creative = 1,
    Adventure = 2,
    Spectator = 3,
}

export enum GameruleType {
    Boolean = 1,
    Integer = 2,
    Float = 3,
}

export interface Gamerule {
    name: string,
    type: GameruleType,
    value: boolean | number,
}

export enum Generator {
    Old = 0,
    Infinite = 1,
    Flat = 2
}

export enum PermissionLevel {
    Visitor = 0,
    Member = 1,
    Operator = 2,
    Custom = 3,
}