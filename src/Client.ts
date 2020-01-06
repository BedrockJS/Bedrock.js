import zlib from 'zlib';
import Address from '@/interfaces/Address';
import Bedrock from '@/network/bedrock/Protocol';
import Packet from '@/network/Packet';
import ACK from '@/network/raknet/ACK';
import ConnectionRequest from '@/network/raknet/ConnectionRequest';
import ConnectionRequestAccepted from '@/network/raknet/ConnectionRequestAccepted';
import Datagram from '@/network/raknet/Datagram';
import EncapsulatedPacket from '@/network/raknet/EncapsulatedPacket';
import NAK from '@/network/raknet/NAK';
import Protocol from '@/network/raknet/Protocol';
import Server from '@/Server';
import { BinaryStream } from '@/utils';
import Logger from '@/utils/Logger';
import AvailableEntityIdentifiers from './network/bedrock/packets/AvailableEntityIdentifiers';
import GamePacket from './network/bedrock/packets/GamePacket';
import Login from './network/bedrock/packets/Login';
import PlayStatus, { PlayStatusIndicator } from './network/bedrock/packets/PlayStatus';
import StartGame from './network/bedrock/packets/StartGame';
import ConnectedPing from './network/raknet/ConnectedPing';
import ConnectedPong from './network/raknet/ConnectedPong';
import GamePacketWrapper from './network/raknet/GamePacketWrapper';
import NewIncomingConnection from './network/raknet/NewIncomingConnection';
import Reliability from './network/raknet/Reliability';
import Player from './Player';
import ResourcePackInfoPacket from './network/bedrock/packets/ResourcePackInfoPacket';
import DisconnectPacket from './network/bedrock/packets/DisconnectPacket';
import ResourcePackStackPacket from './network/bedrock/packets/ResourcePackStackPacket';

export default class Client {

    private static TICK_INTERVAL = 100; // Milliseconds

    public id: number | null = null;

    public address: Address;

    public windowStart: number = 0;
    public windowEnd: number = 2048;
    public mtuSize: number;
    public messageIndex: number = 0;
    public sequenceNumber: number = 0;
    public lastSequenceNumber: number = -1;
    public highestSequenceNumberThisTick: number = -1;
    public splitId: number = 0;

    public channelIndex: number[] = [];

    public ACKQueue: ACK = new ACK();
    public NAKQueue: NAK = new NAK();

    public datagramQueue: Datagram[] = [];
    public packetQueue: Datagram = new Datagram();

    public recoveryQueue: Map < number, Datagram > = new Map();

    public tickInterval: NodeJS.Timeout;

    public protocol: number = 0;

    private lastUpdate: number = Date.now();

    private server: Server;

    private logger: Logger;

    private player!: Player;

    constructor(address: Address, mtuSize: number, server: Server) {
        this.address = address;
        this.mtuSize = mtuSize;
        this.server = server;

        this.packetQueue.needsBAndAs = true;

        this.logger = new Logger('Client');

        this.tickInterval = setInterval(() => {
            this.tick();
        }, Client.TICK_INTERVAL);
    }

    public disconnect(reason: string = 'unknown reason') {
        clearInterval(this.tickInterval);
        this.server.removeClient(this);

        this.logger.debug(`${this.address.ip}:${this.address.port} disconnected: "${reason}"`);
    }

    public handlePackets(datagram: Datagram) {
        this.lastUpdate = Date.now();

        const packets = datagram.packets;

        const diff = datagram.sequenceNumber - this.lastSequenceNumber;

        if (this.NAKQueue.ids.length) {
            const index = this.NAKQueue.ids.findIndex(i => i === datagram.sequenceNumber)
            if (index !== -1) this.NAKQueue.ids.splice(index, 1);

            if (diff !== 1) {
                for (let i = this.lastSequenceNumber + 1; i < datagram.sequenceNumber; i++) {
                    this.NAKQueue.ids.push(i);
                }
            }
        }

        this.ACKQueue.ids.push(datagram.sequenceNumber);

        if (diff >= 1) {
            this.lastSequenceNumber = datagram.sequenceNumber;
        }

        packets.forEach(packet => this.handleEncapsulatedPacket(packet));
    }

    public handlePacket(packet: Packet) {
        this.lastUpdate = Date.now();

        if (packet instanceof EncapsulatedPacket) return this.handleEncapsulatedPacket(packet);

        if (packet instanceof ACK) {
            this.logger.debug('Got ACK:', packet.ids);
            packet.ids.forEach(id => {
                const pk = this.recoveryQueue.get(id);
                if (pk) {
                    this.recoveryQueue.delete(id);
                }
            })
        }

        if (packet instanceof NAK) {
            this.logger.debug('Got NAK:', packet.ids)
            packet.ids.forEach(id => {
                const pk = this.recoveryQueue.get(id);
                if (pk) {
                    this.datagramQueue.push(pk);
                    this.recoveryQueue.delete(id);
                }
            })
        }
    }

    public queueEncapsulatedPacket(packet: EncapsulatedPacket, immediate: boolean = false) {
        if (packet.isReliable()) {
            packet.messageIndex = this.messageIndex++;
        }

        if (packet.isSequenced()) {
            packet.orderIndex = this.channelIndex[packet.orderChannel]++;
        }

        const maxSize = this.mtuSize - 60;

        if (packet.getStream().buffer.length > maxSize) {
            const splitId = ++this.splitId % 65536;
            let splitIndex = 0;
            const splitCount = Math.ceil(packet.getStream().length / maxSize);

            while (!packet.getStream().feof()) {
                const stream = new BinaryStream(packet.getStream().buffer.slice(
                    packet.getStream().offset,
                    packet.getStream().offset += maxSize,
                ))
                const pk = new EncapsulatedPacket();
                pk.splitId = splitId;
                pk.hasSplit = true;
                pk.splitCount = splitCount;
                pk.reliability = packet.reliability;
                pk.splitIndex = splitIndex;
                pk.setStream(stream);

                if (splitIndex > 0) {
                    pk.messageIndex = this.messageIndex++;
                } else {
                    ;
                    pk.messageIndex = packet.messageIndex;
                }

                pk.orderChannel = packet.orderChannel;
                pk.orderIndex = packet.orderIndex;

                this.addToQueue(pk, immediate);
                splitIndex++;
            }
        } else {
            if (packet.isReliable()) {
                packet.messageIndex = this.messageIndex++;
            }
            this.addToQueue(packet, immediate);
        }
    }

    private tick() {
        const time = Date.now();
        if ((this.lastUpdate + 10000) < time) {
            this.disconnect('Connection timed out');

            return;
        }

        if (this.ACKQueue.ids.length) {
            this.server.send(this.ACKQueue.encode(), this.address);
            this.ACKQueue.reset();
        }

        if (this.NAKQueue.ids.length) {
            this.server.send(this.NAKQueue.encode(), this.address);
            this.NAKQueue.reset();
        }

        if (this.datagramQueue.length) {
            const limit = 16;
            let i = 0;
            this.datagramQueue.forEach(async (datagram, index) => {
                if (i > limit) return;

                this.recoveryQueue.set(datagram.sequenceNumber, datagram);
                this.server.send(datagram.encode(), this.address);
                this.datagramQueue.splice(index, 1);

                i++;
            })
        }

        if (this.recoveryQueue.size) {
            // TODO: Check time
            this.recoveryQueue.forEach((pk, seq) => {
                this.datagramQueue.push(pk);
                this.recoveryQueue.delete(seq);
            })
        }

        if (this.packetQueue.packets.length) {
            this.sendPacketQueue();
        }
    }

    private addToQueue(packet: EncapsulatedPacket, immediate: boolean = false) {
        const length = this.packetQueue.packets.length;
        if ((length + packet.getStream().length) > (this.mtuSize - 36)) {
            this.sendPacketQueue();
        }

        if (packet.needsACK) {
            this.logger.debug('Packet needs ACK:', packet.getId());
        }

        this.packetQueue.packets.push(packet);

        if (immediate) {
            this.sendPacketQueue();
        }
    }

    private sendPing(reliability: Reliability = Reliability.Unreliable) {
        const packet = new ConnectedPing(null, this.server.getTime());
        packet.reliability = reliability;

        this.queueEncapsulatedPacket(packet, true);
    }

    private sendPacketQueue() {
        this.packetQueue.sequenceNumber = this.sequenceNumber++;
        this.recoveryQueue.set(this.packetQueue.sequenceNumber, this.packetQueue);

        this.server.send(this.packetQueue.encode(), this.address);
        this.packetQueue.reset();
    }

    private sendPacket(packet: GamePacket, immediate = false, needACK = false) {
        this.queueEncapsulatedPacket(packet, immediate);

        this.logger.debug(`-> ${packet.getId()}`);
    }

    private sendPlayStatus(status: PlayStatusIndicator, immediate = false) {
        const packet = new PlayStatus(status);
        this.sendPacket(packet, immediate);
    }

    private handleEncapsulatedPacket(packet: EncapsulatedPacket) {
        switch (packet.getId()) {
            case Protocol.CONNECTION_REQUEST:
                this.handleConnectionRequest(ConnectionRequest.fromEncapsulated(packet));
                break;
            case Protocol.NEW_INCOMING_CONNECTION:
                this.handleNewIncomingConnection(NewIncomingConnection.fromEncapsulated(packet));
                break;
            case Protocol.CONNECTED_PING:
                this.handleConnectedPing(ConnectedPing.fromEncapsulated(packet));
                break;;
            case Protocol.CONNECTED_PONG:
                this.handleConnectedPong(ConnectedPong.fromEncapsulated(packet));
                break;
            case Protocol.GAME_PACKET_WRAPPER:
                this.handleGamePacket(GamePacketWrapper.fromEncapsulated(packet));
                break;
            case Protocol.DISCONNECTION_NOTIFICATION:
                this.disconnect('Client disconnected');
                break;
            default:
                this.logger.error('Packet not yet implemented:', packet.getId());
                this.logger.error(packet.getStream().buffer);
        }
    }

    private handleConnectionRequest(packet: ConnectionRequest) {
        this.id = packet.clientId;

        const reply = new ConnectionRequestAccepted(this.address, packet.sendPingTime, this.server.getTime());
        reply.reliability = Reliability.Unreliable;
        reply.orderChannel = 0;
        this.queueEncapsulatedPacket(reply, true);
    }

    private handleNewIncomingConnection(packet: NewIncomingConnection) {
        // TODO: Add state and set it to connected here
        this.player = new Player(this);

        this.sendPing();
    }

    private handleConnectedPing(packet: ConnectedPing) {
        const pong = new ConnectedPong(null, packet.sendPingTime, this.server.getTime());
        pong.reliability = Reliability.Unreliable;

        this.queueEncapsulatedPacket(pong);
    }

    private handleConnectedPong(packet: ConnectedPong) {
        // k
    }

    private handlePacketTest(err: Error|null, buffer: Buffer) {
        if (!err) {
            const pStream = new BinaryStream(buffer);

            while (!pStream.feof()) {
                const stream = new BinaryStream(pStream.readString());

                switch (stream.buffer[0]) {
                    case Bedrock.LOGIN:
                        this.handleLogin(new Login(stream));
                        break;
                    default:
                        this.logger.error('Game packet not yet implemented:', stream.buffer[0]);
                        this.logger.error(stream.buffer);
                }
            }
        } else {
            // need this until i pass logger through callback
            // this.logger.error(err);
            console.error(err);
            return;
        }
    }

    private handleGamePacket(packet: GamePacketWrapper) {
        this.logger.debug(`<-`, packet.getId());
        const handlePacket = this.handlePacketTest;
        return zlib.unzip(packet.getStream().buffer.slice(1), handlePacket);
    }

    private handleLogin(packet: Login) {
        this.logger.debug('Got login. Username:', packet.username);

        this.player.username = this.player.displayName = packet.username;
        this.player.clientUUID = packet.clientUUID;
        this.player.xuid = packet.xuid;
        this.player.publicKey = packet.publicKey;

        this.protocol = packet.protocol;

        this.sendPlayStatus(PlayStatusIndicator.Okay);
        this.sendStartGame();
    }

    private sendStartGame() {
        const packet = new StartGame();
        packet.worldName = this.server.getName();
        this.sendPacket(packet);

        this.sendPacket(new AvailableEntityIdentifiers());
        this.sendPacksInfo();
    }

    private sendPacksInfo() {
        const packet = new ResourcePackInfoPacket();

        this.sendPacket(packet);
        this.sendPacksStack();
    }

    private sendPacksStack() {
        const packet = new ResourcePackStackPacket();

        this.sendPacket(packet);
    }

}