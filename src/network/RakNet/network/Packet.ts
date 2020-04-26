import Protocol from './Protocol';
import BinaryStream from '../Utils/BinaryStream';

abstract class Packet {
    private id: Protocol;
    private stream: BinaryStream;
    private encoded: Boolean = false;

    constructor (id: Protocol, stream?: BinaryStream) {
        this.id = id;
        if (!stream) {
            this.stream = new BinaryStream();
        } else {
            this.stream = stream;
            this.stream.increaseOffset(1);
        }
    }

    public getId(): Protocol {
        return this.id;
    }

    public isEncoded(): Boolean {
        return this.encoded;
    }

    public getStream(): BinaryStream {
        return this.stream;
    }

    public setStream(stream: BinaryStream, updateId: boolean = false): void {
        this.stream = stream;

        if (updateId) {
            this.id = this.stream.buffer[0];
        }
    }

    protected encodeHeader() {
        // Write packet id to stream.
        this.stream.writeByte(this.id);
    }

    public encode(): BinaryStream {
        if (!this.encoded) {
            this.encoded = true;
            this.stream = new BinaryStream();
            this.encodeHeader();
            this.encodeBody();
            return this.stream;
        } else {
            throw 'Packet not decoded.';
        }
    }

    protected encodeBody(): any {
        return;
    }
}

export default Packet;