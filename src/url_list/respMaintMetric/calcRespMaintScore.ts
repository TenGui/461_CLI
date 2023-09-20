function calcRespMaintScore(issuesSolved: number, time: number): number {

  //console.log(`{"issuesSolved": ${issuesSolved}, "time": ${time}}`);

  if (issuesSolved <= 0) {
    return 0;
  }

  const denom = 1 + Math.exp(-1 * issuesSolved / time);
  const res = 1 / denom;

  return res;
}

export {calcRespMaintScore}