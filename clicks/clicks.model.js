const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    clickTime: {type: Date, default: Date.now}
});

schema.set('toJSON', {
    a_string: String,
    a_date: Date
});

module.exports = mongoose.model('Clicks', schema);