import Protocol from '../Protocol';
import BinaryStream from '../../Utils/BinaryStream';
import AcknowledgePacket from './AcknowledgePacket';

export default class NAK extends AcknowledgePacket {

    constructor(stream?: BinaryStream) {
        super(Protocol.NAK, stream);
    }

}