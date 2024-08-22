const { messageSchema } = require('../support/validation');
const Message = require('../model/message.js');

const sendMessage = async (req, res) => {
    try {
        const { sequence, response, options } = req.body;

        // Validate the request body
        const { error } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if the sequence already exists
        const existingMessage = await Message.findOne({ sequence });

        if (existingMessage) {
            // Update the existing message
            existingMessage.response = response;
            existingMessage.options = options;
            const updatedMessage = await existingMessage.save();

            return res.status(200).json({
                message: 'Message updated successfully',
                data: updatedMessage
            });
        }

        // Create a new message
        const newMessage = new Message({
            sequence,
            response,
            options
        });

        await newMessage.save();
        res.status(201).json({
            message: 'Message created successfully',
            data: newMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing request', error });
    }
}
const getAllMessage = async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
}

const getSingleMessage = async (req, res) => {
    try {
        const message = await Message.findOne({ sequence: req.params.sequence });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json(message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving message', error });
    }
}

const updateMessage = async (req, res) => {
    try {
        const { response, options } = req.body;

        // Validate the request body
        const { error } = messageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedMessage = await Message.findOneAndUpdate(
            { sequence: req.params.sequence },
            { response, options },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({
            message: 'Message updated successfully',
            data: updatedMessage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating message', error });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findOneAndDelete({ sequence: req.params.sequence });

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting message', error });
    }
}

module.exports = { sendMessage, getAllMessage, getSingleMessage, updateMessage, deleteMessage }