import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'

export default class DisconnectPacket extends EncapsulatedPacket {

  private hideDisconnectionScreen: boolean = false
  public disconnectMessage: string = ''

  constructor() {
    super(Packet.DISCONNECT)

    this.hideDisconnectionScreen = this.getStream().readBool()
    //this.disconnectMessage = this.getStream().readString()
  }

  protected encodeBody() {
    this.getStream().writeBool(this.hideDisconnectionScreen)

    if (!this.hideDisconnectionScreen) this.getStream().writeString(this.disconnectMessage)
  }

}
