function generateMessage(from, text) {
    return {
        from: from,
        text: text,
        createdOn: new Date().getTime()
    };
}

module.exports = {generateMessage};
