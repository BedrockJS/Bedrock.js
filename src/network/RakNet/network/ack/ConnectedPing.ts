import BinaryStream from '../../Utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';
import Protocol from '../Protocol';

export default class ConnectedPing extends EncapsulatedPacket {

    public sendPingTime: number;

    constructor(stream: BinaryStream | null, sendPingTime?: number) {
        super(Protocol.CONNECTED_PING, stream || new BinaryStream());

        this.sendPingTime = sendPingTime || this.getStream().readLong();
    }

    protected encodeBody() {
        this.getStream().writeLong(this.sendPingTime);
    }

}