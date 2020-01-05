import Packet from '@/network/Packet'
import Protocol from '@/network/raknet/Protocol'

export default class OpenConnectionReplyOne extends Packet {

  public mtuSize: number

  constructor(mtuSize: number) {
    super(Protocol.OPEN_CONNECTION_REPLY_1)

    this.mtuSize = mtuSize
  }

  protected encodeBody() {
    return this.getStream()
      .writeMagic()
      .writeLong(Protocol.SERVER_ID)
      .writeByte(0)
      .writeShort(this.mtuSize)
  }

}
