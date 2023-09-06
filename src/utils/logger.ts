//https://www.youtube.com/watch?v=2kKeQl_m8iY&ab_channel=RichardOliverBray
import pino from 'pino';

/*
const transportConfig = {
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
        },
    },
}
*/

const transport = pino.transport({
    targets: [{
      level: 'trace',
      target: 'pino/file',
      options: { 
        destination: './logs.log',
        }
    }]
  })
  const logger = pino(transport);

export function logMsg(msg: string, option?: string) {
    if(option == "info" || option === undefined) {
        logger.info(msg);
    } else if(option == "error") {
        logger.error(msg);
    } else if(option == "fatal") {
        logger.fatal(msg);
    }
}