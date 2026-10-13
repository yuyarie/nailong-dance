// Positive error means the player hit later than the already-offset chart.
export function recommendOffset(errors, baseOffset) {
  const values = errors.filter(Number.isFinite);
  if (values.length < 10 || !Number.isFinite(baseOffset)) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const offset = Math.max(-1000, Math.min(1000, Math.round((baseOffset + mean) / 10) * 10));
  return { mean, offset, count: values.length };
}
