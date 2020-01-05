import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'

export default class ServerToClientHandshakePacket extends EncapsulatedPacket {

  constructor() {
    super(Packet.SERVER_TO_CLIENT_HANDSHAKE)
  }

}
