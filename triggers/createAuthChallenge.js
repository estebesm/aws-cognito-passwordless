const {sendEmail} = require('../helpers/ses')

module.exports = {
  async handler (event) {
    let secretLoginCode;
    if (!event.request.session || !event.request.session.length) {
      secretLoginCode = '123456'
      await sendEmail(event.request.userAttributes.email, secretLoginCode);
    } else {
      const previousChallenge = event.request.session.slice(-1)[0];
      secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
    }
    event.response.publicChallengeParameters = {
      email: event.request.userAttributes.email
    };

    event.response.privateChallengeParameters = { secretLoginCode };

    event.response.challengeMetadata = `CODE-${secretLoginCode}`;

    return event
  }
}
