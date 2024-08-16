const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sequence: {
        type: String,
        required: true,
        unique: true
    },
    response: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        default: []
    }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
