const AWS = require("aws-sdk");
const { sendResponse, validateInput } = require("../utils");

const {user_pool_id, client_id} = process.env

const cognito = new AWS.CognitoIdentityServiceProvider();

const handler = async (event) => {
    try {
        const { email, code, session } = JSON.parse(event.body);
        const response = await cognito.adminRespondToAuthChallenge({
            ClientId: client_id,
            UserPoolId: user_pool_id,
            ChallengeName: "CUSTOM_CHALLENGE",
            Session: session,
            ChallengeResponses: {
                ANSWER: code,
                USERNAME: email
            }
        }).promise()

        return sendResponse(200, {
            accessToken: response.AuthenticationResult.AccessToken,
            refreshToken: response.AuthenticationResult.RefreshToken
        })

    } catch (error) {
        const message = error.message ? error.message : "Internal serv";
        return sendResponse(500, { message });
    }
};

module.exports = {
    handler
}