import { Difficulty, Dimension, Edition, Gamemode, Gamerule, Generator, PermissionLevel } from '@/interfaces'
import { Vector3 } from 'math3d'
import GamePacket from './GamePacket'
import Protocol from '../Protocol'

export default class StartGame extends GamePacket {

  public entityId: number = 0 // varlong
  public runtimeId: number = 0 // varulong

  public gamemode: Gamemode = Gamemode.Surivival // varint

  public position: Vector3 = new Vector3(0, 20, 0) // float<x y z>

  public yaw: number = 0.0 // float
  public pitch: number = 0.0 // float

  public seed: number = 0 // varint
  public dimension: Dimension = Dimension.Overworld // varint
  public generator: Generator = Generator.Infinite // varint
  public worldGamemode: Gamemode = Gamemode.Surivival // varint
  public difficulty: Difficulty = Difficulty.Normal // varint

  public spawnPosition: Vector3 = new Vector3(0, 20, 0) // varint<x y z>

  public allowCheats: boolean = true // bool

  public time: number = 0 // varint

  public edition: Edition = Edition.Vanilla // ubyte

  public allowEduFeatures: boolean = this.edition === Edition.Edu // bool

  public rainLevel: number = 0 // float
  public lightningLevel: number = 0 // float

  public isMultiplayer: boolean = true // bool
  public broadcastToLAN: boolean = true // bool
  public broadcastToXboxLive: boolean = true // bool
  public allowCommands: boolean = true // bool
  public textureRequired: boolean = false // bool

  public rules: Gamerule[] = [] // <string ubyte (bool | varuint | float)>[]

  public allowBonusChest: boolean = false // bool
  public allowStartingMap: boolean = false // bool
  public trustPlayers: boolean = false // bool

  public permissionLevel: PermissionLevel = PermissionLevel.Member // varint
  public xboxLiveBroadcastMode: number = 0 // varint

  public chunkRadius: number = 4 // uint

  public platformBroadcast: boolean = false // bool

  public platformBroadcastMode: number = 0 // varint

  public xboxLiveBroadcastIntent: boolean = false // bool
  public behaviourPackLocked: boolean = false // bool
  public resourcePackLocked: boolean = false // bool
  public worldTemplateLocked: boolean = false // bool

  public levelId: string = '' // string, base64
  public worldName: string = '' // string
  public worldTemplate: string = '' // string

  public isTrial: boolean = false // bool

  public currentTick: number = 0 // ulong, only if isTrial

  public ehchantmentSeed: number = 0 // varint

  public runtimeIds: number[] = [] // varulong[]

  public mutiplayerCorrelationId: string = ''

  constructor() {
    super(Protocol.START_GAME)
  }

  protected encodeBody() {
    this.getStream()
      .writeVarLong(this.entityId)
      .writeUnsignedVarLong(this.runtimeId)
      .writeVarInt(this.gamemode)
      .writeVector3Float(this.position)
      .writeFloat(this.yaw)
      .writeFloat(this.pitch)
      .writeVarInt(this.seed)
      .writeVarInt(this.dimension)
      .writeVarInt(this.generator)
      .writeVarInt(this.worldGamemode)
      .writeVarInt(this.difficulty)
      .writeVector3VarInt(this.spawnPosition)
      .writeBool(this.allowCheats)
      .writeVarInt(this.time)
      .writeBool(this.edition === Edition.Edu)
      .writeBool(this.allowEduFeatures)
      .writeFloat(this.rainLevel)
      .writeFloat(this.lightningLevel)
      .writeBool(this.isMultiplayer)
      .writeBool(this.broadcastToLAN)
      .writeBool(this.broadcastToXboxLive)
      .writeBool(this.allowCommands)
      .writeBool(this.textureRequired)
      .writeGamerules(this.rules)
      .writeBool(this.allowBonusChest)
      .writeBool(this.allowStartingMap)
      .writeBool(this.trustPlayers)
      .writeVarInt(this.permissionLevel)
      .writeVarInt(this.xboxLiveBroadcastMode)
      .writeLInt(this.chunkRadius)
      .writeString(this.levelId)
      .writeString(this.worldName)
      .writeString(this.worldTemplate)
      .writeBool(this.worldTemplateLocked)
      .writeLLong(this.currentTick)
      .writeVarInt(this.ehchantmentSeed)
  }

}
