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
