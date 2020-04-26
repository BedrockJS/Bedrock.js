import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';

export default class ConnectionRequest extends EncapsulatedPacket {

    public clientId: number;
    public sendPingTime: number;
    public hasSecurity: boolean;

    constructor(stream: BinaryStream) {
        super(Protocol.CONNECTION_REQUEST, stream);

        this.clientId = this.getStream().readLong();
        this.sendPingTime = this.getStream().readLong();
        this.hasSecurity = this.getStream().readBool();
    }

}