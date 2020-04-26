import Packet from '../Packet';
import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';

export default class OpenConnectionRequestOne extends Packet {

    public protocol: number;
    public mtuSize: number;

    constructor(stream: BinaryStream) {
        super(Protocol.OPEN_CONNECTION_REQUEST_1, stream);

        this.getStream().offset = 17;
        this.protocol = this.getStream().readByte();
        this.mtuSize = this.getStream().length - 17;
    }

}
