export enum AddressFamily {
    IPV4 = 4,
    IPV6 = 6,
}

export default interface Address {
    ip: string,
    port: number,
    family: AddressFamily
}