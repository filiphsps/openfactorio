import Packet from './Packet';

export default class ConnectionRequest2 extends Packet {
    public static NetID: number = 0x04;

    public username!: string;
    public uuid!: number;
    public uuid2!: number;

    public encode() {
        this.writeShort(0x0100);
        this.writeLInt(this.uuid);
        this.writeLInt(this.uuid2);

        this.writeByte(0x4c);
        this.writeByte(0xc3);
        this.writeByte(0x7e);
        this.writeByte(0xa2);

        this.writeString(this.username);

        this.writeByte(0x00);
        this.writeByte(0x00);
        this.writeByte(0x00);

        this.writeByte(0x95);
        this.writeByte(0x49);
        this.writeByte(0xca);
        this.writeByte(0x95);
        this.writeByte(0x33);
        this.writeByte(0x4b);
        this.writeByte(0xe4);
        this.writeByte(0xb4);
        this.writeByte(0x01);

        this.writeString('base');

        this.writeByte(0x01);
        this.writeByte(0x01);
        this.writeByte(0x27);
        this.writeByte(0xf3);
        this.writeByte(0x09);
        this.writeByte(0x8a);
        this.writeByte(0x74);
        this.writeByte(0x00);
    }
}
