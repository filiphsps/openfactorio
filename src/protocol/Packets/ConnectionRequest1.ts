import Packet from './Packet';

export default class ConnectionRequest1 extends Packet {
    public static NetID: number = 0x01;

    public uuid!: number;
    public build!: number;

    constructor() {
        super();
        this.build = 58937; // TODO: don't use "magic numbers"
        this.uuid = 0xbeef; // TODO: random
    }

    public encode() {
        this.reset();
        this.writeByte(0x22);
        this.writeByte(0x00);

        this.writeLShort(ConnectionRequest1.NetID);

        this.writeByte(0x01);
        this.writeByte(0x27);
        this.writeLShort(this.build);
        this.writeLInt(this.uuid);
    }
}
