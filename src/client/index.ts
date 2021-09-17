import BinaryStream from '@jsprismarine/jsbinaryutils';
import ConnectionRequest1 from '../protocol/Packets/ConnectionRequest1';
import ConnectionRequest2 from '../protocol/Packets/ConnectionRequest2';
import ConnectionResponse1 from '../protocol/Packets/ConnectionResponse1';
import ConnectionResponse2 from '../protocol/Packets/ConnectionResponse2';
import { EventEmitter } from 'events';
import Packet from '../protocol/Packets/Packet';
import PacketRegistry from '../protocol/PacketRegistry';
import dgram from 'dgram';

const prettifyHex = (str: string): string => {
    return `\n${str
        .replace(/([0-9a-fA-F]{2})/g, '$1 ')
        .split(' ')
        .map((v, i) => (i % 2 === 0 ? ' ' + v : v))
        .join(' ')
        .trim()
        .split('  ')
        .map((v, i) => (i % 4 === 0 ? '\n' + v : v))
        .join('  ')
        .trim()}\n`;
};

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

            try {
                const type = data.readByte() & 0b11011111;
                const isFragmented = (type & 0b01000000) > 0;
                const isLastFragment = (type & 0b10000000) > 0;

                if (isFragmented || isLastFragment) {
                    const readArray = (
                        stream: BinaryStream,
                        callback: any
                    ): any[] => {
                        const res = [];
                        const length = stream.readVarInt();

                        for (let i = 0; i < length; i++)
                            res.push(callback(this));

                        return res;
                    };

                    // TODO: do this properly
                    let messageId: number = '0x' as any;
                    for (let i = 0; i < 8; i++) {
                        let byte = `${data.readByte().toString(16)}`;
                        if (byte.length < 2) byte = `0${byte}`;

                        (messageId as any) += byte;
                    }

                    messageId = Number.parseInt(
                        (messageId as unknown) as any,
                        16
                    );

                    let fragmentId;
                    let confirm: number[] = [];

                    if (isFragmented) {
                        if ((fragmentId = data.readByte()) == 0xff) {
                            // TODO: Like really, do this shit properly...
                            fragmentId = '0x' as any;
                            for (let i = 0; i < 8; i++) {
                                let byte = `${data.readByte().toString(16)}`;
                                if (byte.length < 2) byte = `0${byte}`;

                                (fragmentId as any) += byte;
                            }

                            fragmentId = Number.parseInt(
                                (fragmentId as unknown) as any,
                                16
                            );
                        }
                    }

                    if ((messageId & 0x8000) > 0) {
                        confirm = readArray(data, (x: any) => x.readLLong());
                    }

                    messageId = messageId & 0x7fff;
                    // console.log(messageId, fragmentId, confirm);
                }

                const packet = new (PacketRegistry.getPacketByID(type))(
                    message,
                    data.getOffset() - 1
                );
                packet.decode();

                console.info(
                    `Received packet 0x${packet.getID().toString(16)}`,
                    packet
                );

                switch (packet.getID()) {
                    case ConnectionResponse1.NetID: {
                        const req = new ConnectionRequest2();
                        req.username = 'openfactorio';
                        req.uuid = (packet as ConnectionResponse1).uuid;
                        req.uuid2 = (packet as ConnectionResponse1).uuid2;
                        await this.send(req);
                        break;
                    }
                    case ConnectionResponse2.NetID: {
                        console.log('TODO');
                        break;
                    }
                    default: {
                        console.error(
                            `Unknown packet with id "0x${packet
                                .getID()
                                .toString(16)}": ${prettifyHex(
                                data.getBuffer().toString('hex')
                            )}`
                        );
                    }
                }
            } catch (error) {
                console.error(error as any);
                const packet = new Packet();
                packet.append(data.getBuffer());
                packet.setOffset(1);
                console.log(packet);
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
        packet.uuid = Math.floor(Math.random() * 0xbeef);
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
                    console.info(`Sent packet`, packet);
                    resolve(null);
                }
            );
        });
    }
}
