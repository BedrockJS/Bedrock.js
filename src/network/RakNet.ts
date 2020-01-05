import Client from '@/Client'
import Address from '@/interfaces/Address'
import IncompatibleProtocol from '@/network/raknet/IncompatibleProtocol'
import OpenConnectionReplyOne from '@/network/raknet/OpenConnectionReplyOne'
import OpenConnectionReplyTwo from '@/network/raknet/OpenConnectionReplyTwo'
import OpenConnectionRequestOne from '@/network/raknet/OpenConnectionRequestOne'
import OpenConnectionRequestTwo from '@/network/raknet/OpenConnectionRequestTwo'
import Protocol from '@/network/raknet/Protocol'
import UnconnectedPing from '@/network/raknet/UnconnectedPing'
import UnconnectedPong from '@/network/raknet/UnconnectedPong'
import Server from '@/Server'
import { BinaryStream } from '@/utils'
import Logger from '@/utils/Logger'

export default class RakNet {

    private server: Server

    private logger: Logger

    constructor(server: Server) {
        this.server = server

        this.logger = new Logger('RakNet')
    }

    public handleUnconnectedPacket(stream: BinaryStream, recipient: Address) {
        const id = stream.buffer[0]

        switch (id) {
            case Protocol.UNCONNECTED_PING:
                this.handleUnconnectedPing(stream, recipient)
                break
            case Protocol.OPEN_CONNECTION_REQUEST_1:
                this.handleOpenConnectionRequestOne(stream, recipient)
                break
            case Protocol.OPEN_CONNECTION_REQUEST_2:
                this.handleOpenConnectionRequestTwo(stream, recipient)
                break
            default:
                this.logger.error('Unimplemented packet:', id)
        }
    }

    public handleUnconnectedPing(stream: BinaryStream, recipient: Address) {
        const ping = new UnconnectedPing(stream)
        const pong = new UnconnectedPong(ping.pingId, this.server.getName(), this.server.getMaxPlayers())
        this.server.send(pong.encode(), recipient)
    }

    public handleOpenConnectionRequestOne(stream: BinaryStream, recipient: Address) {
        const req = new OpenConnectionRequestOne(stream)

        if (req.protocol !== Protocol.PROTOCOL_VERSION) {
            const packet = new IncompatibleProtocol()
            this.server.send(packet.encode(), recipient)
        } else {
            const packet = new OpenConnectionReplyOne(req.mtuSize)
            this.server.send(packet.encode(), recipient)
        }
    }

    public handleOpenConnectionRequestTwo(stream: BinaryStream, recipient: Address) {
        const req = new OpenConnectionRequestTwo(stream)

        const packet = new OpenConnectionReplyTwo(req.port, req.mtuSize)
        if (!this.server.hasClient(recipient)) {
            const client = new Client(recipient, req.mtuSize, this.server)
            this.server.addClient(client)

            this.logger.debug('Created client for', `${client.address.ip}:${client.address.port}`)

            this.server.send(packet.encode(), recipient)
        }
    }

}