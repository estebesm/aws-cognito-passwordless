const AWS = require("aws-sdk");
const { sendResponse, validateInput } = require("../utils");

const {user_pool_id, client_id} = process.env
const password =  'estebes123';

const cognito = new AWS.CognitoIdentityServiceProvider();

const handler = async (event) => {
    try {
        const isValid = validateInput(event.body);
        if (!isValid) return sendResponse(400, { message: "Invalid input" });

        const { email } = JSON.parse(event.body);
        const params = {
            AuthFlow: "CUSTOM_AUTH",
            UserPoolId: user_pool_id,
            ClientId: client_id,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            },
        };
        const response = await cognito.adminInitiateAuth(params).promise();
        return sendResponse(200, {
            message: "Success",
            session: response.Session
        });
    } catch (error) {
        const message = error.message ? error.message : "Internal server error";
        return sendResponse(500, {
            message
        });
    }
};

module.exports = {
    handler
}