import Packet from '../Packet'
import Protocol, { SERVER_ID } from '../Protocol'
import BinaryStream from '../../Utils/BinaryStream';

export default class IncompatibleProtocol extends Packet {
    public protocol: number;
    public serverId: number;

    constructor() {
        super(Protocol.INCOMPATIBLE_PROTOCOL);

        this.protocol = this.getStream().readByte();
        this.getStream().readMagic();
        this.serverId = this.getStream().readLong();
        return this;
    }

    protected encodeBody(): BinaryStream {
        return this.getStream()
            .writeByte(Protocol.PROTOCOL_VERSION)
            .writeMagic()
            .writeLong(SERVER_ID);
    }

}