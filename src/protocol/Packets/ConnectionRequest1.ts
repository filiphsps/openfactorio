import Packet from './Packet';

export default class ConnectionRequest1 extends Packet {
    public static NetID: number = 0x02;

    public uuid!: number;
    public build!: number;

    constructor() {
        super();
        this.build = 58937; // TODO: don't use "magic numbers"
        this.uuid = 0xbeef; // TODO: random
    }

    public encode() {
        this.writeByte(0x00);
        this.writeByte(0x00);

        this.writeVersion('1.1.39');

        this.writeLShort(this.build);
        this.writeLInt(this.uuid);
    }
}
