import { redisClient } from "../../../config/redis.js";

export const CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS = 30;
export const CUSTOMER_OTP_HOURLY_WINDOW_SECONDS = 60 * 60;
export const CUSTOMER_OTP_MAX_SENDS_PER_HOUR = 5;

export type CustomerOtpSendAllowance =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: "COOLDOWN" | "HOURLY_LIMIT";
      retryAfterSeconds: number;
    };

function getCooldownKey(mobile: string): string {
  return `auth:customer:otp:cooldown:${mobile}`;
}

function getHourlyLimitKey(mobile: string): string {
  return `auth:customer:otp:hourly:${mobile}`;
}

/**
 * Atomic Lua script to reserve OTP allowance.
 *
 * KEYS[1]: Cooldown Key
 * KEYS[2]: Hourly Limit Key
 * ARGV[1]: Cooldown TTL (seconds)
 * ARGV[2]: Hourly Window TTL (seconds)
 * ARGV[3]: Max Sends Per Hour
 *
 * Return Array:
 * [1]        -> Allowed
 * [0, 1, ttl] -> Blocked: COOLDOWN
 * [0, 2, ttl] -> Blocked: HOURLY_LIMIT
 */
const RESERVE_OTP_LUA_SCRIPT = `
  local cooldownKey = KEYS[1]
  local hourlyKey = KEYS[2]
  local cooldownSeconds = tonumber(ARGV[1])
  local hourlyWindowSeconds = tonumber(ARGV[2])
  local maxHourlySends = tonumber(ARGV[3])

  -- 1. Check Cooldown
  local cooldownTtl = redis.call('TTL', cooldownKey)
  if cooldownTtl > 0 then
    return {0, 1, cooldownTtl}
  end

  -- 2. Check Hourly Limit
  local currentHourly = tonumber(redis.call('GET', hourlyKey) or "0")
  if currentHourly >= maxHourlySends then
    local hourlyTtl = redis.call('TTL', hourlyKey)

if hourlyTtl <= 0 then
  redis.call(
    'EXPIRE',
    hourlyKey,
    hourlyWindowSeconds
  )

  hourlyTtl = hourlyWindowSeconds
end

return {0, 2, hourlyTtl}
  end

  -- 3. Reserve Allowance (Atomic Write)
  redis.call('SET', cooldownKey, '1', 'EX', cooldownSeconds)
  
  local newHourlyCount = redis.call(
  'INCR',
  hourlyKey
)

local hourlyTtl = redis.call(
  'TTL',
  hourlyKey
)

if newHourlyCount == 1 or hourlyTtl <= 0 then
  redis.call(
    'EXPIRE',
    hourlyKey,
    hourlyWindowSeconds
  )
end

  return {1}
`;

export async function reserveCustomerOtpSend(mobile: string): Promise<CustomerOtpSendAllowance> {
  const cooldownKey = getCooldownKey(mobile);
  const hourlyLimitKey = getHourlyLimitKey(mobile);

  // Execute atomically in Redis
  const result = (await redisClient.eval(RESERVE_OTP_LUA_SCRIPT, {
    keys: [cooldownKey, hourlyLimitKey],
    arguments: [
      CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS.toString(),
      CUSTOMER_OTP_HOURLY_WINDOW_SECONDS.toString(),
      CUSTOMER_OTP_MAX_SENDS_PER_HOUR.toString(),
    ],
  })) as [number] | [number, number, number];

  if (result[0] === 1) {
    return { allowed: true };
  }

  const reason = result[1] === 1 ? "COOLDOWN" : "HOURLY_LIMIT";
  const ttl =
    result[2] && result[2] > 0
      ? result[2]
      : reason === "COOLDOWN"
        ? CUSTOMER_OTP_RESEND_COOLDOWN_SECONDS
        : CUSTOMER_OTP_HOURLY_WINDOW_SECONDS;

  return {
    allowed: false,
    reason,
    retryAfterSeconds: ttl,
  };
}
