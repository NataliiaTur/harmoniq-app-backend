import pino from 'pino-http';

export const loggerPino = pino({
  transport: {
    target: 'pino-pretty',
  },
});
