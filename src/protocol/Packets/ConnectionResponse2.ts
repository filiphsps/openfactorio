import Packet from './Packet';

export default class ConnectionResponse2 extends Packet {
    public static NetID: number = 0xe5;

    public version!: string;
    public build!: number;
    public uuid!: number;
    public uuid2!: number;

    public decode() {
        const unknown = this.readLong();
        this.uuid = this.readLInt();
        this.uuid2 = this.readLInt();
    }
}
