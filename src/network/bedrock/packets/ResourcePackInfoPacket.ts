import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'
import ResourcePack from '@/resource-packs/ResourcePack'

export default class ResourcePackInfoPacket extends EncapsulatedPacket {

  private mustAccept: boolean = false
  private hasScripts: boolean = false

  private resourcePackEntries: Array<ResourcePack> = []
  private behaviorPackEntries: Array<ResourcePack> = []

  constructor() {
    super(Packet.RESOURCE_PACKS_INFO)
  }

  protected encodeBody() {
    this.getStream()
      .writeBool(this.mustAccept)
      .writeBool(this.hasScripts)
      .writeLShort(this.behaviorPackEntries.length)

    this.behaviorPackEntries.forEach(entry => {
      this.getStream()
        .writeString('')
        .writeString('')
        .writeLLong(0)
        .writeString('')
        .writeString('')
    })

    this.getStream().writeLShort(this.resourcePackEntries.length)

    this.resourcePackEntries.forEach(entry => {
      this.getStream()
        .writeString('')
        .writeString('')
        .writeLLong(0)
        .writeString('')
        .writeString('')
    })
  }

}
