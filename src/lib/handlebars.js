const { format } = require('timeago.js');

const helpers = {};

helpers.timeago =  (timeago) => {
    return format(timeago);
}
module.exports = helpers;