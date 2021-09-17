import Packet from './Packet';

export default class ConnectionResponse1 extends Packet {
    public static NetID: number = 0xc3;

    public version!: string;
    public build!: number;
    public uuid!: number;
    public uuid2!: number;

    public decode() {
        this.version = this.readVersion();

        this.build = this.readLShort();

        this.uuid = this.readLInt();
        this.uuid2 = this.readLInt();
    }
}
