import Packet from '@/network/bedrock/Protocol'
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket'
import ResourcePack from '@/resource-packs/ResourcePack'

export default class ResourcePackStackPacket extends EncapsulatedPacket {

	private mustAccept: boolean = false
	private hasScripts: boolean = false

	private resourcePackStack: Array<ResourcePack> = []
	private behaviorPackStack: Array<ResourcePack> = []

	constructor() {
		super(Packet.RESOURCE_PACK_STACK)
	}

	protected encodeBody() {
		this.getStream()
			.writeBool(this.mustAccept)
			.writeBool(this.hasScripts)
			.writeUnsignedVarInt(this.behaviorPackStack.length)

		this.behaviorPackStack.forEach(entry => {
			this.getStream()
				.writeString('')
				.writeString('')
				.writeString('')
		})

		this.getStream().writeUnsignedVarInt(this.resourcePackStack.length)
		this.resourcePackStack.forEach(entry => {
			this.getStream()
				.writeString('')
				.writeString('')
				.writeString('')
		})
	}
}