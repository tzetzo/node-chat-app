const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from,     //same as from: from
        text,
        createdOn: moment().valueOf()   //get the milliseconds only & later in the front end we can format them the way we need them
    };
}

const generateLocationMessage = (from, latitude, longitude) => {
    return {
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdOn: moment().valueOf()
    };
}

module.exports = {generateMessage, generateLocationMessage};
