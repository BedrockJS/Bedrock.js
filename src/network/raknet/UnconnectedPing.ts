import Packet from '@/network/Packet'
import Protocol from '@/network/raknet/Protocol'
import { BinaryStream } from '@/utils'

export default class UnconnectedPing extends Packet {

  public pingId: number

  constructor(stream: BinaryStream) {
    super(Protocol.UNCONNECTED_PING, stream)

    this.pingId = this.getStream().readLong()
  }

}
