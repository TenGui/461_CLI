import logger from "./utils/logger.ts";
import { logMsg } from "./utils/logger.ts";

logger.info("Hello");
logger.error("Hello");
logger.fatal("Hello");

// Just Run ts-node pinoEx.ts as usual and all of the logging data should show up
// info - basic info statement
// error - denote error
// fatal - denote serious warning code error etc

// logMsg function
// param 1 : string: message being logged
// param 2 : string(optional): defaults to info, enter info for info, error for error, fatal for fatal

logMsg("Hello");
logMsg("Hello 2", "info");
logMsg("Hello 3", "error");
logMsg("Hello 4", "fatal");
