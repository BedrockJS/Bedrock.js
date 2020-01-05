import Packet from '@/network/Packet'
import Protocol from '@/network/raknet/Protocol'

export default class OpenConnectionReplyTwo extends Packet {

  public port: number
  public mtuSize: number

  constructor(port: number, mtuSize: number) {
    super(Protocol.OPEN_CONNECTION_REPLY_2)

    this.port = port
    this.mtuSize = mtuSize
  }

  protected encodeBody() {
    return this.getStream()
      .writeMagic()
      .writeLong(Protocol.SERVER_ID)
      .writeShort(this.port)
      .writeShort(this.mtuSize)
      .writeByte(0)
  }

}
