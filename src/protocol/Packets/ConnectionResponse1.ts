import Packet from './Packet';

export default class ConnectionResponse1 extends Packet {
    public static NetID: number = 0xe3;

    public uuid!: number;
    public build!: number;

    constructor() {
        super();
    }

    public decode() {
        const id = this.readByte();
        const unknown = this.readLong();
        const version = [
            this.readByte(),
            this.readByte(),
            this.readByte()
        ].join('.');

        this.build = this.readLShort();
        this.uuid = this.readLInt();

        const unknown2 = this.readLInt();

        console.log(
            id.toString(16),
            unknown,
            version,
            this.build,
            this.uuid,
            unknown2
        );
    }
}
