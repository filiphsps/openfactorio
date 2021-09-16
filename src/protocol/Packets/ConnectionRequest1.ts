import Packet from './Packet';

export default class ConnectionRequest1 extends Packet {
    public static NetID: number = 0x02;

    public version!: string;
    public uuid!: number;
    public build!: number;

    constructor() {
        super();
        this.version = '1.1.39';
        this.build = 58937; // TODO: don't use "magic numbers"
        this.uuid = 0xbeef; // TODO: random
    }

    public decode() {
        this.readByte();
        this.readByte();

        this.version = this.readVersion();
        this.build = this.readLShort();
        this.uuid = this.readLInt();
    }

    public encode() {
        this.writeByte(0x00);
        this.writeByte(0x00);

        this.writeVersion(this.version);

        this.writeLShort(this.build);
        this.writeLInt(this.uuid);
    }
}
