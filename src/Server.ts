import dgram from 'dgram';
import { EventEmitter } from 'events';
import Client from '@/Client';
import { ServerOptions } from '@/interfaces';
import Address from '@/interfaces/Address';
import RakNet from '@/network/RakNet';
import ACK from '@/network/raknet/ACK';
import Datagram from '@/network/raknet/Datagram';
import NAK from '@/network/raknet/NAK';
import { BinaryStream } from '@/utils';
import BitFlag from '@/utils/BitFlag';
import Logger from '@/utils/Logger';

export default class Server extends EventEmitter {

    private ip: string
    private port: number
    private name: string
    private maxPlayers: number

    private startTime: number
    private raknet: RakNet

    private clients: Client[]

    private socket!: dgram.Socket

    private logger: Logger

    constructor(options: ServerOptions, bind: boolean = true) {
        super();

        this.ip = options.address || '0.0.0.0';
        this.port = options.port || 19132;
        this.name = options.name;
        this.maxPlayers = options.maxPlayers || 50;

        this.startTime = Math.floor(Date.now());

        this.raknet = new RakNet(this);

        this.clients = [];

        this.logger = new Logger('Server');

        if (bind) {
            this.socket = dgram.createSocket('udp4');

            this.startListeners()
            if (bind) this.socket.bind(this.port, this.ip, () => {
                /* */ 
            });
        }
    }

    public getLogger(): Logger {
        return this.logger;
    }

    public close() {
        this.socket.close();
    }

    public getName() {
        return this.name;
    }

    public getMaxPlayers() {
        return this.maxPlayers;
    }

    public getTime() {
        return Math.floor(Date.now()) - this.startTime;
    }

    public hasClient(address: Address) {
        return !!this.getClient(address);
    }

    public getClient(address: Address) {
        return this.clients.find(client => client.address.ip === address.ip && client.address.port === address.port);
    }

    public addClient(client: Client) {
        this.clients.push(client);
    }

    public removeClient(client: Client) {
        const index = this.clients
            .findIndex(c => c.address.ip === client.address.ip && c.address.port === client.address.port);
        if (index === -1) return;

        this.clients.splice(index, 1);
    }

    public send(stream: BinaryStream, to: Address) {
        this.socket.send(
            stream.buffer,
            to.port,
            to.ip,
        );
    }

    private startListeners() {
        this.socket.on('message', (message: Buffer, recipient: dgram.RemoteInfo) => {
            if (!message.length) return;

            const stream = new BinaryStream(message);

            try {
                this.handleOnMessage(stream, {
                    family: recipient.family === 'IPv4' ? 4 : 6,
                    ip: recipient.address,
                    port: recipient.port,
                });
            } catch (e) {
                this.logger.error(e.message);
                this.logger.error(e.stack);
            }
        })

        this.socket.on('error', (err: Error) => {
            this.logger.error(err);
        })

        this.socket.on('listening', () => {
            this.logger.info(`Bedrock.js listening on ${this.ip}:${this.port}`);
        })
    }

    private async handleOnMessage(stream: BinaryStream, recipient: Address) {
        const packetId = stream.buffer[0]
        if (this.hasClient(recipient)) {
            if ((packetId & BitFlag.Valid) === 0) {
                this.logger.debug('Ignored packet:', packetId);
                return
            }

            const client = this.getClient(recipient);
            if (!client) return

            if (packetId & BitFlag.ACK) {
                client.handlePacket(new ACK(stream));
            } else if (packetId & BitFlag.NAK) {
                client.handlePacket(new NAK(stream));
            } else {
                const datagram = Datagram.fromBinary(stream);

                client.handlePackets(datagram);
            }
        } else {
            if (packetId !== 0x01) this.logger.debug('Unconnected packet:', packetId);
            this.raknet.handleUnconnectedPacket(stream, recipient);
        }
    }

}