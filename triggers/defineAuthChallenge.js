module.exports = {
  async handler(event) {
    if (
        event.request.session &&
        event.request.session.find(
            attempt => attempt.challengeName !== 'CUSTOM_CHALLENGE'
        )
    ) {
      // We only accept custom challenges; fail auth
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
        event.request.session &&
        event.request.session.length >= 3 &&
        event.request.session.slice(-1)[0].challengeResult === false
    ) {
      // The user provided a wrong answer 3 times; fail auth
      event.response.issueTokens = false;
      event.response.failAuthentication = true;
    } else if (
        event.request.session &&
        event.request.session.length &&
        event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' &&
        event.request.session.slice(-1)[0].challengeResult === true
    ) {
      // The user provided the right answer; succeed auth
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = 'CUSTOM_CHALLENGE';
    }
    return event;
  }
};
