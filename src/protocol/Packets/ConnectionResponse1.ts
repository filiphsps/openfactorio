import Packet from './Packet';

export default class ConnectionResponse1 extends Packet {
    public static NetID: number = 0x128;

    public uuid!: number;
    public build!: number;

    constructor() {
        super();
    }

    public decode() {
        const unknown = this.readLShort();
        const id = this.readLShort();
        const unknown2 = this.readLInt();
        const unknown3 = this.readLInt();

        this.build = this.readLShort();
        this.uuid = this.readLInt();
        console.log(unknown, id, unknown2, unknown3, this.build, this.uuid);
    }
}
