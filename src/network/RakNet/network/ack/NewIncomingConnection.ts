import Address from '../../Types';
import BinaryStream from '../../Utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';
import Protocol from '../Protocol';

export default class NewIncomingConnection extends EncapsulatedPacket {

    public address: Address
    public systemAddresses: Address[] = []
    public sendPingTime: number
    public sendPongTime: number

    constructor(stream: BinaryStream) {
        super(Protocol.NEW_INCOMING_CONNECTION, stream);
        this.address = this.getStream().readAddress();

        for (let i = 0; i < Protocol.SYSTEM_ADDRESSES; i++) {
            this.systemAddresses.push(this.getStream().readAddress());
        }

        this.sendPingTime = this.getStream().readLong();
        this.sendPongTime = this.getStream().readLong();
    }

}