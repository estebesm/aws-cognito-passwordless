const AWS = require("aws-sdk");
const { sendResponse, validateInput } = require("../utils");

const {user_pool_id} = process.env
const password =  'estebes123';

const cognito = new AWS.CognitoIdentityServiceProvider();

const handler = async (event) => {
    try {
        const isValid = validateInput(event.body);
        if (!isValid) return sendResponse(400, { message: "Invalid input" });

        const { email } = JSON.parse(event.body);
        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: "email",
                    Value: email,
                }
            ],
        };
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true,
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise();
        }

        return sendResponse(200, {
            message: "User registration successful",
        });
    } catch (error) {
        console.log(error)
        const message = error.message ? error.message : "Internal server error";
        return sendResponse(500, { message });
    }
};

module.exports = {
    handler
}