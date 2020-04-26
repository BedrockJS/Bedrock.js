import Packet from '../Packet';
import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';
import AcknowledgePacket from './AcknowledgePacket';

export default class ACK extends AcknowledgePacket {

    constructor(stream?: BinaryStream) {
        super(Protocol.ACK, stream);
    }

}