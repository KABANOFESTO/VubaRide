const express = require("express");
const dotenv = require("dotenv");
const Message = require("../models/message");
const Africastalking = require("africastalking");
dotenv.config();

const router = express.Router();
const username = process.env.USERNAME;
const apikey = process.env.API_KEY;

const africastalking = Africastalking({
    apiKey: apikey,
    username: username
});

const sms = africastalking.SMS;

// Simulate a payment process (replace this with actual payment logic)
const initiatePayment = async (phoneNumber, amount) => {
    return new Promise((resolve, reject) => {
        // Simulate success or failure
        setTimeout(() => {
            resolve(true); // payment successful
        }, 2000);
    });
};

router.post("/ussd", async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    console.log("information:", req.body);
    let response = "";

    try {
        if (text === "") {
            response = `CON Welcome to VubaRide! Choose language:
            1. Kinyarwanda
            2. English`;
        } else {
            const messageData = await Message.findOne({ sequence: text });

            if (messageData) {
                // If the sequence leads to a route selection, proceed to payment
                if (messageData.options && messageData.options.length > 0) {
                    response = `CON ${messageData.response}\n`;
                    messageData.options.forEach((option, index) => {
                        response += `${index + 1}. ${option}\n`;
                    });
                } else if (text.match(/\*1$|\*2$|\*3$/)) { // Match the route selection sequence
                    const routeInfo = messageData.response.split("(");
                    const route = routeInfo[0].trim();
                    const amount = routeInfo[1].split("RWF")[0].trim();

                    response = `CON You selected ${route}. The cost is ${amount} RWF. Do you want to proceed with the payment?
                    1. Yes
                    2. No`;
                } else if (text.endsWith("*1")) { // Payment confirmation
                    const previousText = text.split("*").slice(0, -1).join("*");
                    const routeMessageData = await Message.findOne({ sequence: previousText });

                    if (routeMessageData) {
                        const amount = routeMessageData.response.split("(")[1].split("RWF")[0].trim();

                        const paymentSuccess = await initiatePayment(phoneNumber, amount);

                        if (paymentSuccess) {
                            sms.send({
                                to: phoneNumber,
                                message: `Payment successful! Your ticket for ${routeMessageData.response} is confirmed.`
                            }).then((smsResponse) => {
                                console.log(smsResponse);
                            }).catch((error) => {
                                console.error(error);
                            });
                            response = "END Payment successful! Your ticket has been sent via SMS.";
                        } else {
                            response = "END Payment failed. Please try again.";
                        }
                    } else {
                        response = "END Route not found. Please try again.";
                    }
                } else if (text.endsWith("*2")) { // Payment cancellation
                    response = "END Payment cancelled.";
                } else {
                    response = `CON ${messageData.response}`;
                }
            } else {
                response = "END Invalid selection. Please try again.";
            }
        }
    } catch (error) {
        console.error(error);
        response = "END An error occurred. Please try again later.";
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
});

module.exports = router;
