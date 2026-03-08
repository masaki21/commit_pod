type PerfMeta = Record<string, unknown> | undefined;

type PerfMeasureOptions = {
  logAll?: boolean;
  slowThresholdMs?: number;
};

const DEFAULT_SLOW_THRESHOLD_MS = 24;

function isPerfEnabled() {
  if (typeof __DEV__ !== 'undefined') return __DEV__;
  return process.env.NODE_ENV !== 'production';
}

function nowMs() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

function printPerf(prefix: string, label: string, meta?: PerfMeta) {
  if (!isPerfEnabled()) return;
  if (meta) {
    console.info(`[perf:${prefix}] ${label}`, meta);
    return;
  }
  console.info(`[perf:${prefix}] ${label}`);
}

export function perfEvent(label: string, meta?: PerfMeta) {
  printPerf('event', label, meta);
}

export function perfTap(label: string, meta?: PerfMeta) {
  printPerf('tap', label, meta);
}

export function perfScreenTransition(from: string, to: string, meta?: PerfMeta) {
  printPerf('screen', `${from} -> ${to}`, meta);
}

export function perfMeasureSync<T>(
  label: string,
  fn: () => T,
  meta?: PerfMeta,
  options?: PerfMeasureOptions
): T {
  const start = nowMs();
  const result = fn();
  const durationMs = nowMs() - start;
  const slowThresholdMs = options?.slowThresholdMs ?? DEFAULT_SLOW_THRESHOLD_MS;
  if (options?.logAll || durationMs >= slowThresholdMs) {
    printPerf('sync', label, { ...meta, durationMs: Number(durationMs.toFixed(2)) });
  }
  return result;
}

export async function perfMeasureAsync<T>(
  label: string,
  fn: () => Promise<T>,
  meta?: PerfMeta,
  options?: PerfMeasureOptions
): Promise<T> {
  const start = nowMs();
  try {
    return await fn();
  } finally {
    const durationMs = nowMs() - start;
    const slowThresholdMs = options?.slowThresholdMs ?? DEFAULT_SLOW_THRESHOLD_MS;
    if (options?.logAll || durationMs >= slowThresholdMs) {
      printPerf('async', label, { ...meta, durationMs: Number(durationMs.toFixed(2)) });
    }
  }
}

