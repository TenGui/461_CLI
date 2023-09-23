function calcRespMaintScore(issuesSolved: number, time: number): number {
  if (issuesSolved <= 0 || time <= 0) {
    return 0;
  }
  const denom = 1 + Math.exp(-1 * (issuesSolved / time - 1.5));
  const res = 1 / denom;

  return res;
}

export {calcRespMaintScore}