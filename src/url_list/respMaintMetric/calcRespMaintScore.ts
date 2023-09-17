function calcRespMaintScore(issuesSolved: number, time: number): number {
    if (issuesSolved <= 0) {
      return 0;
    }
    const denom = 1 + Math.exp((-0.5 * issuesSolved) / time - 8);
    const res = 1 / denom;
    return res;
  }
  
  export { calcRespMaintScore };