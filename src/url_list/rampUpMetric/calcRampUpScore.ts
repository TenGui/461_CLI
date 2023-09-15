function calcRampUpScore(linesMD: number, linesJS: number): number {
  if (linesJS <= 0) {
    return 0;
  }
  const denom = 1 + Math.exp((-3 * linesMD) / linesJS);
  const res = 2 / denom - 1;
  return res;
}

export { calcRampUpScore };
