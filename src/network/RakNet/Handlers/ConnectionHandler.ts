import Packet from "../network/Packet";
import Connection from '../Utils/Connection';
import Address from '../Types';

class ConnectionHandler {
    private connections: Connection[];
    private packetPool: Map<Number, Packet>;

    constructor () {
        this.connections = [];
        this.packetPool = new Map();
    }

    hasConnection(client: Address): Boolean {
        return !!this.getConnection(client);
    }

    getConnection(client: Address): Connection {
        return this.connections.find((c) => { c.address.ip === client.ip && c.address.port === client.port });
    }

    closeAllConnections(reason = 'Unknown Reason') {
        this.packetPool.clear();
        this.connections.forEach((c) => {
            c.disconnect(reason);
        });
    }
}

export default ConnectionHandler;