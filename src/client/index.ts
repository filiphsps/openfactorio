import BinaryStream from '@jsprismarine/jsbinaryutils';
import ConnectionRequest1 from '../protocol/Packets/ConnectionRequest1';
import ConnectionResponse1 from '../protocol/Packets/ConnectionResponse1';
import { EventEmitter } from 'events';
import Packet from '../protocol/Packets/Packet';
import dgram from 'dgram';

export default class Client extends EventEmitter {
    private udpSocket!: dgram.Socket;

    private port!: number;
    private host!: string;

    constructor(config: any) {
        super();

        this.udpSocket = dgram.createSocket({ type: 'udp4' });
    }

    async connect(config: { host: string; port: number }) {
        this.host = config.host;
        this.port = config.port;

        const data = new BinaryStream();
        data.append(Buffer.from('3fc265', 'hex'));
        console.log('192.168.86.128', data.getBuffer().readInt8());

        // return;

        this.udpSocket.on('message', (message, remote) => {
            // TODO: streamline this
            const packet = new ConnectionResponse1();
            packet.append(message);
            packet.setOffset(0);
            packet.decode();

            console.log(packet);
        });

        this.udpSocket.on('listening', async () => {
            var address = this.udpSocket.address();
            console.log(
                'UDP Server listening on ' +
                    address.address +
                    ':' +
                    address.port
            );
        });

        this.udpSocket.on('close', () => {
            console.log('closed');
        });

        this.udpSocket.on('error', (error) => {
            console.log('error: ', error);
        });

        await new Promise((resolve, reject) => {
            console.log(`Connecting to ${this.host}:${this.port}!`);

            this.udpSocket.bind(() => {
                resolve(null);
            });
        });
        const packet = new ConnectionRequest1();
        await this.send(packet);
    }

    private async send(packet: Packet) {
        packet.encode();
        const data = new BinaryStream();
        data.append(packet.getBuffer());

        // TODO: this should probably be a generic function
        return new Promise((resolve, reject) => {
            this.udpSocket.send(
                data.getBuffer(),
                0,
                data.getBuffer().length,
                this.port,
                this.host,
                (error: any, bytes: any) => {
                    if (error) return reject(error);

                    // TODO: remove
                    console.info(
                        `Sent packet with ID ${packet.getName()}, size: ${bytes}`
                    );
                    resolve(null);
                }
            );
        });
    }
}
