import ConnectionRequest1 from './Packets/ConnectionRequest1';
import ConnectionRequest2 from './Packets/ConnectionRequest2';
import ConnectionResponse1 from './Packets/ConnectionResponse1';
import ConnectionResponse2 from './Packets/ConnectionResponse2';
import Packet from './Packets/Packet';

class PacketRegistry {
    private readonly packetMap: Map<number, typeof Packet>;

    constructor() {
        this.packetMap = new Map();

        this.registerPacket(ConnectionRequest1.NetID, ConnectionRequest1);
        this.registerPacket(ConnectionRequest2.NetID, ConnectionRequest2);
        this.registerPacket(ConnectionResponse1.NetID, ConnectionResponse1);
        this.registerPacket(ConnectionResponse2.NetID, ConnectionResponse2);
    }

    /**
     * Register custom packet
     *
     * @param id Network ID
     * @param packet Packet class
     */
    public registerPacket(id: number, packet: typeof Packet): void {
        this.packetMap.set(id, packet);
    }

    public getPacketByID(id: number): typeof Packet {
        if (!this.packetMap.has(id))
            throw new Error(
                `No packet registered with ID 0x${id.toString(16)}`
            );

        return this.packetMap.get(id)!;
    }
}

export default new PacketRegistry();
