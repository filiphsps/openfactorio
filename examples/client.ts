import { Client } from '../src/index';

(async () => {
    const client = new Client({
        reconnect: true
    });

    await client.connect({
        host: process.env.HOST || '',
        port: Number.parseInt(process.env.PORT || '34197', 10)
    });

    client.on('connect', (res: any) => {
        console.log('!!', res);
    });

    client.on('message', (packet: any) => {
        console.log('!!', packet);
    });
})();
