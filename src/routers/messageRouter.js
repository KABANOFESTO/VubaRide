const { sendMessage, getAllMessage, getSingleMessage, updateMessage, deleteMessage } = require('../Controller/messageController');
const express = require('express');
const passport = require("passport");
require('../middleware/passport');

const router = express.Router();

// Create or update a message
router.post('/', passport.authenticate("jwt", { session: false }), sendMessage);

// Get all messages
router.get('/', getAllMessage);

// Get a single message by sequence
router.get('/:sequence', getSingleMessage);

// Update a message by sequence
router.put('/:sequence', passport.authenticate("jwt", { session: false }), updateMessage);

// Delete a message by sequence
router.delete('/:sequence', passport.authenticate("jwt", { session: false }), deleteMessage);

module.exports = router;
