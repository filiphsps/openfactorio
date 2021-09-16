import Packet from './Packet';

export default class ConnectionRequest1 extends Packet {
    public static NetID: number = 0x22;

    public uuid!: number;
    public build!: number;

    constructor() {
        super();
        this.build = 58937; // TODO: don't use "magic numbers"
        this.uuid = 0xbeef; // TODO: random
    }

    public encode() {
        this.reset();

        this.writeByte(ConnectionRequest1.NetID);

        this.writeByte(0x00);
        this.writeByte(0x00);

        [1, 1, 39].forEach((v) => this.writeByte(v)); // Game version

        this.writeLShort(this.build);
        this.writeLInt(this.uuid);
    }
}
