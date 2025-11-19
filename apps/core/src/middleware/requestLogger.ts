import pinoHttp from "pino-http";
import logger from "../utils/logger";

const requestLogger = pinoHttp({
  logger,
  autoLogging: true,
});

export default requestLogger;
