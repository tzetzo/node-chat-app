const generateMessage = (from, text) => {
    return {
        from,     //same as from: from
        text,
        createdOn: new Date().getTime()
    };
}

const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdOn: new Date().getTime()
    };
}

module.exports = {generateMessage, generateLocationMessage};
