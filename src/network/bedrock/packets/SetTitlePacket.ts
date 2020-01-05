import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'
import { BinaryStream } from '@/utils'

export default class SetTitlePacket extends EncapsulatedPacket {

  public type: number;
  public text: any;

  public fadeInTime: number = 0;
  public fadeOutTime: number = 0;
  public stayTime: number = 0;

  constructor(stream: BinaryStream) {
   super(Packet.SET_TITLE)

   this.type = this.getStream().readVarInt()
   this.text = this.getStream().readString()
   this.fadeInTime = this.getStream().readVarInt()
   this.fadeOutTime = this.getStream().readVarInt()
   this.stayTime = this.getStream().readVarInt()
  }

  protected encodeBody() {
    this.getStream()
      .writeVarInt(this.type)
      .writeString(this.text)
      .writeVarInt(this.fadeInTime)
      .writeVarInt(this.fadeOutTime)
      .writeVarInt(this.stayTime)
  }
}
