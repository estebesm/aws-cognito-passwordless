const sendResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(body),
    };
};

const validateInput = (data) => {
    const body = JSON.parse(data);
    const { email, password } = body;
    return validateEmail(email) && validatePassword(password);
};

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const validatePassword = (password) => {
    //return password.length >= 1
    return true
}

module.exports = {
    sendResponse,
    validateInput,
};