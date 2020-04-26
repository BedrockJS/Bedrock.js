
import Reliability from '../../Utils/Reliability';
import BinaryStream from '../../Utils/BinaryStream';
import Protocol from '../Protocol';
import Packet from '../Packet'


export default class EncapsulatedPacket extends Packet {

    public static fromEncapsulated<T extends EncapsulatedPacket>(
        this: new (stream: BinaryStream) => T, encapsulated: EncapsulatedPacket,
    ): T {
        const packet = new this(encapsulated.getStream());
        packet.reliability = encapsulated.reliability;
        packet.length = encapsulated.length;
        packet.messageIndex = encapsulated.messageIndex;
        packet.hasSplit = encapsulated.hasSplit;
        packet.splitCount = encapsulated.splitCount;
        packet.splitId = encapsulated.splitId;
        packet.splitIndex = encapsulated.splitIndex;
        packet.sequenceIndex = encapsulated.sequenceIndex;
        packet.orderIndex = encapsulated.orderIndex;
        packet.orderChannel = encapsulated.orderChannel;

        return packet;
    }

    public static fromBinary(stream: BinaryStream) {
        const flags = stream.readByte();
        const packet = new EncapsulatedPacket(flags);

        packet.reliability = ((flags & 0xe0) >> 5);
        packet.hasSplit = (flags & 0x10) > 0;

        packet.length = Math.ceil(stream.readShort() / 8);

        if (packet.isReliable()) {
            packet.messageIndex = stream.readLTriad();
        }

        if (packet.isSequenced()) {
            packet.sequenceIndex = stream.readLTriad();
        }

        if (packet.isSequencedOrOrdered()) {
            packet.orderIndex = stream.readLTriad();
            packet.orderChannel = stream.readByte();
        }

        if (packet.hasSplit) {
            packet.splitCount = stream.readInt();
            packet.splitId = stream.readShort();
            packet.splitIndex = stream.readInt();
        }

        packet.setStream(new BinaryStream(stream.buffer.slice(stream.offset, stream.offset + packet.length)), true);
        stream.offset += packet.length;

        return packet;
    }

    public reliability: number = 0;

    public length: number = 0;

    public messageIndex: number = 0;

    public hasSplit: boolean = false;
    public splitCount: number = 0;
    public splitId: number = 0;
    public splitIndex: number = 0;

    public sequenceIndex: number = 0;

    public orderIndex: number = 0;
    public orderChannel: number = 0;

    public needsACK: boolean = false;

    constructor(id: number = Protocol.STRUCTURE_TEMPLATE_DATA_REQUEST, stream?: BinaryStream) {
        super(id, stream);
    }

    public isReliable() {
        return (
            this.reliability === Reliability.Reliable ||
            this.reliability === Reliability.ReliableOrdered ||
            this.reliability === Reliability.ReliableSequenced ||
            this.reliability === Reliability.ReliableACK ||
            this.reliability === Reliability.ReliableOrderedACK
        );
    }

    public isSequenced() {
        return (
            this.reliability === Reliability.UnreliableSequenced ||
            this.reliability === Reliability.ReliableSequenced
        );
    }

    public isOrdered() {
        return (
            this.reliability === Reliability.ReliableOrdered ||
            this.reliability === Reliability.ReliableOrderedACK
        );
    }

    public isSequencedOrOrdered() {
        return this.isSequenced() || this.isOrdered();
    }

    public toBinary() {
        const stream = new BinaryStream();

        let flags = this.reliability << 5;
        if (this.hasSplit) {
            flags = flags | 0x10;
        }

        const packetStream = this.encode();

        stream.writeByte(flags);
        stream.writeShort(packetStream.length << 3);

        if (this.isReliable()) {
            stream.writeLTriad(this.messageIndex);
        }

        if (this.isSequenced()) {
            stream.writeLTriad(this.sequenceIndex);
        }

        if (this.isSequencedOrOrdered()) {
            stream.writeLTriad(this.orderIndex);
            stream.writeByte(this.orderChannel);
        }

        if (this.hasSplit) {
            stream.writeInt(this.splitCount);
            stream.writeShort(this.splitId);
            stream.writeInt(this.splitIndex);
        }

        stream.append(packetStream);

        return stream;
    }

}