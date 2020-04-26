import ConnectionHandler from './Handlers/ConnectionHandler';
import BinaryStream from './Utils/BinaryStream';
import Logger from '@/utils/Logger';
import * as dgram from 'dgram';
import Connection from './Utils/Connection';
import Address from './Types';
import { EventEmitter } from 'events';


class RakNet extends EventEmitter {
    private logger: Logger;
    private connectionHandler: ConnectionHandler;
    private socket: dgram.Socket | null = null;

    constructor () {
        super();
        this.connectionHandler = new ConnectionHandler();
        this.logger = new Logger('RakNet');
    }

    public stop(): void {
        if (this.socket === null) {
            return;
        }
        /** Attempt to disconnect clients before abruptly closing */
        this.logger.debug('Closing active connections');
        this.connectionHandler.closeAllConnections();
        this.socket.close();
    }

    public start(ip: string = '127.0.0.1', port: number): void {
        this.socket = dgram.createSocket('udp4');
        
        this.socket.on('message', (message: Buffer, address: dgram.RemoteInfo) => {
            if (!message.length) return;

            const stream = new BinaryStream(message);

            try {
                this.handleRequest(stream, {
                    family: address.family === 'IPv4' ? 4 : 6,
                    ip: address.address,
                    port: address.port,
                });
            } catch (e) {
                this.logger.error(e.message);
                this.logger.error(e.stack);
            }
        });

        this.socket.on('error', (err: Error) => {
            this.emit('error', err);
            this.logger.error(err);
        });

        this.socket.on('listening', () => {
            this.emit('started');
        });

        this.socket.bind(port, ip, () => {
            this.logger.info('Starting RakNet');
        });
    }

    public async handleRequest(stream: BinaryStream, address: Address): void {
        if (!this.connectionHandler.hasConnection(address)) {
            this.emit('ClientAttemptedConnect', address);
            this.logger.error(`Ignored packet from: ${address.ip} due to no open connection.`);
            return;
        } else {
            const connection: Connection = this.connectionHandler.getConnection(address);
            connection.handleStream(stream);
            return;
        }
    }
}

export default RakNet;