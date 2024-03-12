const { username, div } = require("./details");
//give all the contest of division div
const contestDivision = async (div) => {
  const response = await fetch("https://codeforces.com/api/contest.list");
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  const contests = data.result;
  const type = `Div. ${div}`;
  let contestId = [];
  let contestCt = 0;
  contests.forEach((contest) => {
    const contestName = contest.name;
    if (contestCt > 100) return contestId;
    if (contestName.includes(type) && contest.phase === "FINISHED") {
      contestId.push(contest.id);
      contestCt++;
    }
  });
  return contestId;
};
// urlGenerator
const urlGenerator = (contestId, problemIdx) => {
  const url = `https://codeforces.com/contest/${contestId}/problem/${problemIdx}`;
  return url;
};
// extracting user submission
const userSubmission = async (username) => {
  const response = await fetch(
    `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();
  const submissions = data.result;
  return submissions;
};

// checking if a problem is successfully solved by the user
const checkExistence = async (contestid, problemType, username) => {
  const submissions = await userSubmission(username);
  let flag = false;
  submissions.forEach((el) => {
    if (
      el.contestId === contestid &&
      el.problem.index === problemType &&
      el.verdict === "OK"
    ) {
      flag = true;
      return true;
    }
  });
  if (flag) return true;
  else return false;
};

// Give the unsolved problem of a user
const nProblems = async (username, div) => {
  const contest = await contestDivision(div);
  const problemType = ["A", "B", "C"];
  // finding the question
  while (true) {
    let contestIdx = Math.floor(Math.random() * contest.length);
    let problemIdx = Math.floor(Math.random() * problemType.length);
    const exist = await checkExistence(
      contest[contestIdx],
      problemType[problemIdx],
      username
    );
    if (!exist) {
      console.log(urlGenerator(contest[contestIdx], problemType[problemIdx]));
      return;
    }
  }
};
nProblems(username, div);
