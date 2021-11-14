const getCurrentTimeWithMessage = (message, username) => {
    return {
        message,
        username,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (message, username) => {
    return {
        url: message,
        username,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    getCurrentTimeWithMessage,
    generateLocationMessage
}