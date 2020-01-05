import Packet from '@/network/Packet'
import Protocol from '@/network/raknet/Protocol'

export default class UnconnectedPong extends Packet {

  public pingId: number;
  public name: string;
  public maxPlayers: number;
  public secondaryName: string;
  public version: string;

  constructor(pingId: number, name: string, maxPlayers: number, secondaryName = 'Bedrock.js') {
    super(Protocol.UNCONNECTED_PONG)
    this.version = Protocol.MINECRAFT_VERSION;
    this.pingId = pingId;
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.secondaryName = secondaryName;
  }

  protected encodeBody() {
    const name = `MCPE;${this.name};27;${this.version};0;${this.maxPlayers};0;${this.secondaryName}`

    return this.getStream()
      .writeLong(this.pingId)
      .writeLong(Protocol.SERVER_ID)
      .writeMagic()
      .writeShort(name.length)
      .writeString(name)
  }

}
