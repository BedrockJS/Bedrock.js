import Protocol from '@/network/raknet/Protocol'
import { BinaryStream } from '@/utils'
import AcknowledgePacket from './AcknowledgePacket'

export default class ACK extends AcknowledgePacket {

  constructor(stream?: BinaryStream) {
    super(Protocol.ACK, stream)
  }

}
