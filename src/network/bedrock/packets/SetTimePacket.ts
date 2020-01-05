import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'
import { BinaryStream } from '@/utils'

export default class SetTimePacket extends EncapsulatedPacket {

  public time: number

  constructor(stream: BinaryStream) {
    super(Packet.SET_TIME, stream)

    this.time = this.getStream().readInt()
  }

  protected encodeBody() {
    this.getStream().writeInt(this.time)
  }
}
