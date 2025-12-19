type LogLevel = "debug" | "info" | "warn" | "error";

// const isDev = import.meta.env.DEV;
const isDev = true;

const log = (level: LogLevel, ...args: unknown[]) => {
    if (!isDev && level === "debug") return;
    const fn = console[level] ?? console.log;
    fn(...args);
};

export const logger = {
    debug: (...args: unknown[]) => log("debug" as LogLevel, ...args),
    info: (...args: unknown[]) => log("info" as LogLevel, ...args),
    warn: (...args: unknown[]) => log("warn" as LogLevel, ...args),
    error: (...args: unknown[]) => log("error" as LogLevel, ...args),
};
