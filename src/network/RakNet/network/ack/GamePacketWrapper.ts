import BinaryStream from '../../Utils/BinaryStream';
import EncapsulatedPacket from './EncapsulatedPacket';
import Protocol from '../Protocol';

export default class GamePacketWrapper extends EncapsulatedPacket {

    constructor(stream: BinaryStream) {
        super(Protocol.GAME_PACKET_WRAPPER, stream);
    }

}