// lib/log.ts — the wrapper. Do not modify without explicit instruction.
const isDev = __DEV__;
type Level = "debug" | "info" | "warn" | "error";

const fmt = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (v instanceof Error) return `${v.name}: ${v.message}\n${v.stack ?? ""}`;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
};

export const createLogger = (tag: string) => ({
  debug: (...args: unknown[]) => { if (isDev) console.log(`[${tag}]`, ...args.map(fmt)); },
  info:  (...args: unknown[]) => console.log(`[${tag}]`, ...args.map(fmt)),
  warn:  (...args: unknown[]) => console.warn(`[${tag}]`, ...args.map(fmt)),
  error: (...args: unknown[]) => console.error(`[${tag}]`, ...args.map(fmt)),
});
