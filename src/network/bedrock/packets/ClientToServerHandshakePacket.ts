import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'

export default class ClientToServerHandshakePacket extends EncapsulatedPacket {
  
  constructor() {
    super(Packet.CLIENT_TO_SERVER_HANDSHAKE)
  }

}
