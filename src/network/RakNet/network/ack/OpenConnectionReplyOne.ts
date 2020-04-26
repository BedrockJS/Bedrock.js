import Packet from '../Packet';
import Protocol, { SERVER_ID } from '../Protocol';

export default class OpenConnectionReplyOne extends Packet {

    public mtuSize: number;

    constructor(mtuSize: number) {
        super(Protocol.OPEN_CONNECTION_REPLY_1);

        this.mtuSize = mtuSize;
    }

    protected encodeBody() {
        return this.getStream()
            .writeMagic()
            .writeLong(SERVER_ID)
            .writeByte(0)
            .writeShort(this.mtuSize);
    }

}