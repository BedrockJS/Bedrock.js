import Packet from '../Packet';
import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';

export default class UnconnectedPing extends Packet {

    public pingId: number;

    constructor(stream: BinaryStream) {
        super(Protocol.UNCONNECTED_PING, stream);

        this.pingId = this.getStream().readLong();
    }

}
