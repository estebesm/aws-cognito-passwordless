module.exports = {
  async handler(event) {
    event.response.answerCorrect = event.request.privateChallengeParameters.secretLoginCode === event.request.challengeAnswer;
    return event;
  }
}
