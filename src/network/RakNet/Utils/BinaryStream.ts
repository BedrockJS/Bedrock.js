import Address, { AddressFamily, Gamerule, GameruleType } from '@/interfaces/Interfaces'
import { Magic } from '../network/Protocol';
import { Round } from '@/utils';
import Logger from '@/utils/Logger';
import { Vector3 } from 'math3d';

class BinaryStream {

    public static from(val: string) {
        return new BinaryStream(Buffer.from(val))
    }

    public buffer: Buffer;
    public offset: number;

    private logger: Logger;

    constructor(buffer?: Buffer) {
        this.buffer = Buffer.alloc(0);
        this.offset = 0;

        this.logger = new Logger('BinaryStream');

        if (buffer) {
            this.append(buffer);
            this.offset = 0;
        }
    }

    public get length(): number {
        return this.buffer.length;
    }

    public read(len: number): Buffer {
        return this.buffer.slice(this.offset, this.increaseOffset(len, true));
    }

    public reset() {
        this.buffer = Buffer.alloc(0);
        this.offset = 0;
    }

    public setBuffer(buffer: Buffer = Buffer.alloc(0), offset: number = 0) {
        this.buffer = buffer;
        this.offset = offset;
    }

    public increaseOffset(v: number, ret: boolean = false): number {
        return (ret === true ? (this.offset += v) : (this.offset += v) - v);
    }

    public append(buf: BinaryStream | Buffer | string): this {
        if (buf instanceof BinaryStream) {
            return this.append(buf.buffer);
        }

        if (typeof buf === 'string') {
            buf = Buffer.from(buf, 'hex');
        }

        this.buffer = Buffer.concat([this.buffer, buf], this.buffer.length + buf.length);
        this.offset += buf.length;

        return this;
    }

    public getOffset(): number {
        return this.offset;
    }

    public getBuffer(): Buffer {
        return this.buffer;
    }

    /*
     *******************************
     * Buffer Management Functions *
     *******************************
     */

    public getRemainingBytes(): number {
        return this.buffer.length - this.offset;
    }

    public readRemaining(): Buffer {
        const buf = this.buffer.slice(this.offset);
        this.offset = this.buffer.length;
        return buf;
    }

    public readBool(): boolean {
        return this.readByte() !== 0x00;
    }

    public writeBool(v: boolean): this {
        this.writeByte(v === true ? 1 : 0);
        return this;
    }

    public readByte(): number {
        return this.getBuffer()[this.increaseOffset(1)];
    }

    public writeByte(v: number): this {
        this.append(Buffer.from([v & 0xff]));

        return this;
    }

    public readShort(): number {
        return this.buffer.readUInt16BE(this.increaseOffset(2));
    }

    public writeShort(v: number): this {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(v, 0);
        this.append(buf);

        return this;
    }

    public readSignedShort(): number {
        return this.buffer.readInt16BE(this.increaseOffset(2));
    }

    public writeSignedShort(v: number): this {
        const buf = Buffer.alloc(2);
        buf.writeInt16BE(v, 0);
        this.append(buf);

        return this;
    }

    public readLShort(): number {
        return this.buffer.readUInt16LE(this.increaseOffset(2));
    }

    public writeLShort(v: number): this {
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(v, 0);
        this.append(buf);

        return this;
    }

    public readSignedLShort(): number {
        return this.buffer.readInt16LE(this.increaseOffset(2));
    }

    public writeSignedLShort(v: number): this {
        const buf = Buffer.alloc(2);
        buf.writeInt16LE(v, 0);
        this.append(buf);

        return this;
    }

    public readTriad(): number {
        return this.buffer.readUIntBE(this.increaseOffset(3), 3);
    }

    public writeTriad(v: number): this {
        const buf = Buffer.alloc(3);
        buf.writeUIntBE(v, 0, 3);
        this.append(buf);

        return this;
    }

    public readLTriad(): number {
        return this.buffer.readUIntLE(this.increaseOffset(3), 3);
    }

    public writeLTriad(v: number): this {
        const buf = Buffer.alloc(3);
        buf.writeUIntLE(v, 0, 3);
        this.append(buf);

        return this;
    }

    public readInt(): number {
        return this.buffer.readInt32BE(this.increaseOffset(4));
    }

    public writeInt(v: number): this {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(v, 0);
        this.append(buf);

        return this;
    }

    public readLInt(): number {
        return this.buffer.readInt32LE(this.increaseOffset(4));
    }

    public writeLInt(v: number): this {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(v, 0);
        this.append(buf);

        return this;
    }

    public readFloat(): number {
        return this.buffer.readFloatBE(this.increaseOffset(4));
    }

    public readRoundedFloat(accuracy: number): number {
        return Round(this.readFloat(), accuracy);
    }

    public writeFloat(v: number): this {
        const buf = Buffer.alloc(8);
        const bytes = buf.writeFloatBE(v, 0);
        this.append(buf.slice(0, bytes));

        return this;
    }

    public readLFloat(): number {
        return this.buffer.readFloatLE(this.increaseOffset(4));
    }

    public readRoundedLFloat(accuracy: number): number {
        return Round(this.readLFloat(), accuracy);
    }

    public writeLFloat(v: number): this {
        const buf = Buffer.alloc(8);
        const bytes = buf.writeFloatLE(v, 0);
        this.append(buf.slice(0, bytes));

        return this;
    }

    public readDouble(): number {
        return this.buffer.readDoubleBE(this.increaseOffset(8));
    }

    public writeDouble(v: number): this {
        const buf = Buffer.alloc(8);
        buf.writeDoubleBE(v, 0);
        this.append(buf);

        return this;
    }

    public readLDouble(): number {
        return this.buffer.readDoubleLE(this.increaseOffset(8));
    }

    public writeLDouble(v: number): this {
        const buf = Buffer.alloc(8);
        buf.writeDoubleLE(v, 0);
        this.append(buf);

        return this;
    }

    public readLong(): number {
        return (this.buffer.readUInt32BE(this.increaseOffset(4)) << 8) + this.buffer.readUInt32BE(this.increaseOffset(4));
    }

    public writeLong(v: number): this {
        const MAX_UINT32 = 0xFFFFFFFF;

        const buf = Buffer.alloc(8)
        buf.writeUInt32BE((~~(v / MAX_UINT32)), 0);
        buf.writeUInt32BE((v & MAX_UINT32), 4);
        this.append(buf);

        return this;
    }

    public readLLong(): number {
        return this.buffer.readUInt32LE(0) + (this.buffer.readUInt32LE(4) << 8);
    }

    public writeLLong(v: number): this {
        const MAX_UINT32 = 0xFFFFFFFF;

        const buf = Buffer.alloc(8);
        buf.writeUInt32LE((v & MAX_UINT32), 0);
        buf.writeUInt32LE((~~(v / MAX_UINT32)), 4);
        this.append(buf);

        return this;
    }

    public readUnsignedVarInt(): number {
        let value = 0;

        for (let i = 0; i <= 28; i += 7) {
            const b = this.readByte();
            value |= ((b & 0x7f) << i);

            if ((b & 0x80) === 0) {
                return value;
            }
        }

        return 0
    }

    public writeUnsignedVarInt(v: number): this {
        const stream = new BinaryStream();

        for (let i = 0; i < 5; i++) {
            if ((v >> 7) !== 0) {
                stream.writeByte(v | 0x80);
            } else {
                stream.writeByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }

        this.append(stream.buffer);

        return this;
    }

    public readVarInt(): number {
        const raw = this.readUnsignedVarInt();
        const tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    public writeVarInt(v: number): this {
        v <<= 32 >> 32;
        return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
    }

    public readUnsignedVarLong(): number {
        let value = 0;
        for (let i = 0; i <= 63; i += 7) {
            const b = this.readByte();
            value |= ((b & 0x7f) << i);

            if ((b & 0x80) === 0) {
                return value;
            }
        }
        return 0
    }

    public writeUnsignedVarLong(v: number): this {
        for (let i = 0; i < 10; i++) {
            if ((v >> 7) !== 0) {
                this.writeByte(v | 0x80);
            } else {
                this.writeByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }

        return this;
    }

    public readVarLong(): number {
        const raw = this.readUnsignedVarLong();
        const tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    public writeVarLong(v: number): this {
        return this.writeUnsignedVarLong((v << 1) ^ (v >> 63));
    }

    public feof(): boolean {
        return typeof this.getBuffer()[this.offset] === 'undefined';
    }

    public readAddress(): Address {
        let ip, port, family;
        switch (this.readByte()) {
            default:
            case AddressFamily.IPV4:
                family = AddressFamily.IPV4;
                ip = [];
                for (let i = 0; i < 4; i++) {
                    ip.push(~this.readByte() & 0xff);
                }
                ip = ip.join('.');
                port = this.readShort();
                break;
        }
        return {
            ip,
            port,
            family
        }
    }

    public writeAddress(address: Address): this {
        this.writeByte(address.family);
        switch (address.family) {
            case AddressFamily.IPV4:
                address.ip.split('.', 4).forEach(b => this.writeByte(~parseInt(b, 10) & 0xff));
                this.writeShort(address.port);
                break;
            case AddressFamily.IPV6:
                this.logger.error('IPV6 is not yet supported');
                break;
            default:
                this.logger.error('ERR -> Unknown address family:', address.family);
        }
        return this;
    }

    public writeString(v: string): this {
        this.append(Buffer.from(v, 'utf8'));
        return this;
    }

    public readString() {
        return this.read(this.readUnsignedVarInt());
    }

    public readMagic(): Buffer {
        return this.buffer.slice(this.offset, this.increaseOffset(16, true));
    }

    public writeMagic() {
        this.append(Buffer.from(Magic, 'binary'));
        return this;
    }

    public writeVector3Float(v3: Vector3) {
        this.writeFloat(v3.x);
        this.writeFloat(v3.y);
        this.writeFloat(v3.z);
        return this;
    }

    public writeVector3VarInt(v3: Vector3) {
        this.writeVarInt(v3.x);
        this.writeVarInt(v3.y);
        this.writeVarInt(v3.z);
        return this;
    }

    public writeGamerule(rule: Gamerule) {
        this.writeString(rule.name);
        this.writeByte(rule.type);

        if (rule.type === GameruleType.Boolean && typeof rule.value === 'boolean') this.writeBool(rule.value);
        else if (rule.type === GameruleType.Integer && typeof rule.value === 'number') this.writeUnsignedVarInt(rule.value);
        else if (rule.type === GameruleType.Float && typeof rule.value === 'number') this.writeFloat(rule.value);
        else this.logger.error('Invalid gamerule type or value. Type:', rule.type, '- Value:', rule.value);

        return this;
    }

    public writeGamerules(rules: Gamerule[]) {
        rules.forEach(this.writeGamerule);

        return this;
    }

    public flip(): this {
        this.offset = 0;
        return this;
    }

    public toHex(spaces: boolean = false): string {
        const hex = this.buffer.toString('hex');
        return spaces ? hex.split(/(..)/).filter(v => v !== '').join(' ') : hex;
    }
}

export default BinaryStream;