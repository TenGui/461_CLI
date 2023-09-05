//https://www.youtube.com/watch?v=2kKeQl_m8iY&ab_channel=RichardOliverBray

import pino from 'pino';

const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
        }
    }
});



export default logger;