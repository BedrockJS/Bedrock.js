import BinaryStream from '../../Utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';
import Protocol from '../Protocol';

export default class ConnectedPong extends EncapsulatedPacket {

    public sendPingTime: number
    public sendPongTime: number

    constructor(stream: BinaryStream | null, sendPingTime?: number, sendPongTime?: number) {
        super(Protocol.CONNECTED_PONG, stream || new BinaryStream())

        this.sendPingTime = sendPingTime || this.getStream().readLong()
        this.sendPongTime = sendPongTime || this.getStream().readLong()
    }

    protected encodeBody() {
        this.getStream()
            .writeLong(this.sendPingTime)
            .writeLong(this.sendPongTime)
    }

}