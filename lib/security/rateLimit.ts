import "server-only";

import { env } from "@/lib/env";

export type RateLimitResult = {
  allowed: boolean;
  count: number;
  limit: number;
  windowSeconds: number;
  resetAt: number;
  mocked: boolean;
};

type WindowOptions = {
  limit: number;
  windowSeconds: number;
  scope: string;
  identifier: string;
};

const inMemory = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(opts: WindowOptions): Promise<RateLimitResult> {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const key = `cch:rl:${opts.scope}:${opts.identifier}`;
  const now = Date.now();

  if (!url || !token) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_* not set — using process-memory fallback. Not safe across serverless instances. Set the env vars before production.",
    );
    const existing = inMemory.get(key);
    if (!existing || existing.resetAt <= now) {
      inMemory.set(key, { count: 1, resetAt: now + opts.windowSeconds * 1000 });
      return {
        allowed: true,
        count: 1,
        limit: opts.limit,
        windowSeconds: opts.windowSeconds,
        resetAt: now + opts.windowSeconds * 1000,
        mocked: true,
      };
    }
    existing.count += 1;
    return {
      allowed: existing.count <= opts.limit,
      count: existing.count,
      limit: opts.limit,
      windowSeconds: opts.windowSeconds,
      resetAt: existing.resetAt,
      mocked: true,
    };
  }

  try {
    // Atomic INCR; set TTL only on first hit so the window doesn't slide.
    const incrRes = await upstashCommand(url, token, ["INCR", key]);
    const count = Number(incrRes);
    if (count === 1) {
      await upstashCommand(url, token, ["EXPIRE", key, String(opts.windowSeconds)]);
    }
    const ttlRes = await upstashCommand(url, token, ["TTL", key]);
    const ttl = Math.max(Number(ttlRes), 0);
    const resetAt = now + ttl * 1000;
    return {
      allowed: count <= opts.limit,
      count,
      limit: opts.limit,
      windowSeconds: opts.windowSeconds,
      resetAt,
      mocked: false,
    };
  } catch (err) {
    console.error("[rate-limit] Upstash request threw, failing open:", err);
    return {
      allowed: true,
      count: 0,
      limit: opts.limit,
      windowSeconds: opts.windowSeconds,
      resetAt: now + opts.windowSeconds * 1000,
      mocked: true,
    };
  }
}

async function upstashCommand(
  url: string,
  token: string,
  command: string[],
): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash ${command[0]} failed: ${res.status}`);
  }
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`Upstash ${command[0]} error: ${json.error}`);
  return json.result;
}
