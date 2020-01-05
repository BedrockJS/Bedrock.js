import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'
import { BinaryStream } from '@/utils'

export default class SetHealthPacket extends EncapsulatedPacket {

  public health: number

  constructor(stream: BinaryStream) {
   super(Packet.SET_HEALTH)

   this.health = this.getStream().readVarInt()
  }

  protected encodeBody() {
    this.getStream().writeVarInt(this.health)
  }
}
