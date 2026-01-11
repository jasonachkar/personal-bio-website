import { env } from '@/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private log(level: LogLevel, message: string, data?: unknown, context?: string) {
    // Skip debug logs in production
    if (level === 'debug' && process.env.NODE_ENV === 'production') {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context
    };

    // In a real app, this would send logs to a logging service (Datadog, Sentry, etc.)
    // For now, we wrap console methods to provide a consistent structure
    
    const consoleMethod = level === 'error' ? console.error : 
                          level === 'warn' ? console.warn : 
                          level === 'info' ? console.info : 
                          console.log;

    if (process.env.NODE_ENV === 'development') {
      consoleMethod(`[${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}`, data || '');
    } else {
      // In production, log as JSON for easier parsing by log aggregators
      consoleMethod(JSON.stringify(entry));
    }
  }

  info(message: string, data?: unknown, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string) {
    this.log('error', message, data, context);
  }

  debug(message: string, data?: unknown, context?: string) {
    this.log('debug', message, data, context);
  }
}

export const logger = new Logger();
