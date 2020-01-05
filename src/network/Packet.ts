import BedrockProtocol from '@/network/bedrock/Protocol'
import RakNetProtocol from '@/network/raknet/Protocol'
import { BinaryStream } from '@/utils'

type Protocol = BedrockProtocol | RakNetProtocol

export default class Packet {

  private id: Protocol
  private stream: BinaryStream

  constructor(packetId: Protocol, stream?: BinaryStream) {
    this.id = packetId

    if(stream) {
      this.stream = stream
      this.stream.increaseOffset(1) // Packet ID
    } else {
      this.stream = new BinaryStream()
    }
  }

  public getId(): Protocol {
    return this.id
  }

  public setStream(stream: BinaryStream, updatePacketId: boolean = false) {
    this.stream = stream

    if(updatePacketId) this.id = this.getStream().buffer[0]
  }

  public encode(): BinaryStream {
    this.stream = new BinaryStream()
    this.encodeHeader()
    this.encodeBody()
    return this.stream
  }

  public getStream(): BinaryStream {
    return this.stream
  }

  protected encodeHeader() {
    this.stream.writeByte(this.id)
  }

  protected encodeBody() {
    return
  }

}
