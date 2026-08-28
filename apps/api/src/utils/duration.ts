const durationMultipliers = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
} as const;

export function durationToMilliseconds(duration: string): number {
  const unit = duration.at(-1) as keyof typeof durationMultipliers;
  const amount = Number(duration.slice(0, -1));

  return amount * durationMultipliers[unit];
}
