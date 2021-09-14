import PacketBinaryStream from '../PacketBinaryStream';

export default class Packet extends PacketBinaryStream {
    public getName(): string {
        return this.constructor.name;
    }

    public encode(): any {
        return Buffer.alloc(0);
    }
    public decode(): any {}
}
