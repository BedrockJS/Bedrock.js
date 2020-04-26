import Packet from '../Packet';
import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';

export default class AcknowledgePacket extends Packet {

    public ids: number[] = [];
    public batchable: boolean = false;

    constructor(id: Protocol, stream?: BinaryStream) {
        super(id, stream);

        if (stream) {
            const count = stream.readShort();
            let cnt = 0

            for (let i = 0; i < count && !stream.feof() && cnt < 4096; i++) {
                const byte = stream.readByte();
                if (byte === 0) {
                    const start = stream.readLTriad();
                    let end = stream.readLTriad();
                    if ((end - start) > 512) {
                        end = start + 512
                    }
                    for (let c = start; c <= end; c++) {
                        this.ids.push(c)
                        cnt++
                    }
                } else {
                    this.ids.push(stream.readLTriad());
                    cnt++;
                }
            }
        }
    }

    public reset() {
        this.ids = [];
        this.setStream(new BinaryStream());
    }

    protected encodeBody() {
        const stream = new BinaryStream();
        const ids = this.ids.sort((a, b) => a - b);
        let records = 0;

        if (ids.length) {
            let start = ids[0];
            let last = ids[0];

            ids.forEach(id => {
                if ((id - last) === 1) {
                    last = id;
                } else if ((id - last) > 1) {
                    this.add(stream, start, last);

                    start = last = id;
                    records++;
                }
            })

            this.add(stream, start, last);
            records++;
        }

        this.getStream()
            .writeShort(records)
            .append(stream.getBuffer());
    }

    private add(stream: BinaryStream, a: number, b: number) {
        if (a === b) {
            stream
                .writeBool(true)
                .writeLTriad(a);
        } else {
            stream
                .writeBool(false)
                .writeLTriad(a)
                .writeLTriad(b);
        }
    }

}