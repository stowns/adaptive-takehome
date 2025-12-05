import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';

const logDir = process.env.LOG_DIR || './logs';

// Ensure log directory exists
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'adaptive-takehome' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: `${logDir}/combined.log`,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write errors to error.log
    new winston.transports.File({ 
      filename: `${logDir}/error.log`,
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// If not in production, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export default logger;
