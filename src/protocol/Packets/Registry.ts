import ConnectionRequest1 from './ConnectionRequest1';
import ConnectionRequest2 from './ConnectionRequest2';
import ConnectionResponse1 from './ConnectionResponse1';
import ConnectionResponse2 from './ConnectionResponse2';
import Packet from './Packet';

export const getPacketByID = (id: number): typeof Packet => {
    switch (id) {
        case 0x22:
        case ConnectionRequest1.NetID:
            return ConnectionRequest1;
        case ConnectionRequest2.NetID:
            return ConnectionRequest2;
        case ConnectionResponse1.NetID:
            return ConnectionResponse1;
        case ConnectionResponse2.NetID:
            return ConnectionResponse2;

        default:
            throw new Error(`No packet with ID 0x${id.toString(16)}`);
    }
};
