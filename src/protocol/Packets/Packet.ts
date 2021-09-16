import PacketBinaryStream from '../PacketBinaryStream';

export default class Packet extends PacketBinaryStream {
    public static NetID: number = 0x00;

    public getName(): string {
        return this.constructor.name;
    }

    public getID(): number {
        return (this.constructor as any).NetID;
    }

    public encode(): any {
        return Buffer.alloc(0);
    }
    public decode(): any {}

    public writeVarShort(val: number) {
        if (val > 0xff) {
            this.writeByte(0xff);
            this.writeByte(val);
        } else {
            this.writeByte(val);
        }
    }

    public readVarShort(): number {
        let res;
        if ((res = this.readByte() & 0xff) === 255) res = this.readShort();
        return res;
    }

    public writeVersion(version: string) {
        version.split('.').forEach((val) => this.writeVarShort(parseInt(val)));
    }

    public readVersion(): string {
        const major = this.readVarShort();
        const minor = this.readVarShort();
        const patch = this.readVarShort();
        return `${major}.${minor}.${patch}`;
    }

    public writeString(val: string) {
        this.writeByte(val.length);
        val.split('').forEach((char) => this.writeByte(char.charCodeAt(0)));
    }

    public readString(): string {
        const length = this.readByte();

        let res = '';
        for (let i = 0; i > length; i++) {
            res += String.fromCharCode(this.readByte());
        }

        return res;
    }
}
