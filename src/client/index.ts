import BinaryStream from '@jsprismarine/jsbinaryutils';
import ConnectionRequest1 from '../protocol/Packets/ConnectionRequest1';
import ConnectionRequest2 from '../protocol/Packets/ConnectionRequest2';
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

        this.udpSocket.on('message', async (message, remote) => {
            const data = new BinaryStream(message);
            const packetId = data.readByte();

            switch (packetId) {
                case ConnectionResponse1.NetID: {
                    const res = new ConnectionResponse1();
                    res.append(data.getBuffer());
                    res.setOffset(1);
                    res.decode();

                    const req = new ConnectionRequest2();
                    req.username = 'openfactorio';
                    req.uuid = res.uuid;
                    req.uuid2 = res.uuid2;
                    await this.send(req);
                    break;
                }
                default: {
                    console.warn(
                        `Unknown packet with id "0x${packetId.toString(
                            16
                        )}": ${data.getBuffer().toString('hex')}`
                    );
                }
            }
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
            console.error('error: ', error);
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
        data.writeByte(packet.getID());
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
                        `Sent packet with ID ${packet.getName()}, size: ${bytes}, ${data
                            .getBuffer()
                            .toString('hex')}`
                    );
                    resolve(null);
                }
            );
        });
    }
}
