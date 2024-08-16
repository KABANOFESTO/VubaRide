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

router.post("/ussd", async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    console.log("information:", req.body);
    let response = "";

    if (text === "") {
        response = `CON Welcome to VubaRide! Choose language:
        1. Kinyarwanda
        2. English`;
    } else if (text === "1") {
        response = `CON Urashaka Kugendera Muyihe Agency?
        1. Horizon
        2. Volocanoes`
    } else if (text === "2") {
        response = `CON which Agency do you prefer?
        1. Horizon
        2. Volocanoes`
    } else if (text == "1*1") {
        response = `CON urakaza neza muri Horizon!
        1. Kigali-Muhanga(1500RWF)
        2. Kigali-Musanze(3700RWF)
        3. Kigali-Rusizi(5200RWF)`
    } else if (text == "2*1") {
        response = `CON Welcome To Horizon!
        1. Kigali-Muhanga(1500RWF)
        2. Kigali-Musanze(3700RWF)
        3. Kigali-Rusizi(5200RWF)`
    } else if (text == "1*2") {
        response = `CON urakaza neza muri Volocanoes!
        1. Kigali-Muhanga(1500RWF)
        2. Kigali-Musanze(3700RWF)
        3. Kigali-Rusizi(5200RWF)`
    } else if (text == "2*2") {
        response = `CON Welcome To Volocanoes!
        1. Kigali-Muhanga(1500RWF)
        2. Kigali-Musanze(3700RWF)
        3. Kigali-Rusizi(5200RWF)`
    } else if (text === "1*1*1" || "1*1*2" || "1*1*3") {
        try {
            const messageData = await Message.findOne({ sequence: "1*1*1" || "1*1*2" || "1*1*3" });
            if (messageData) {
                sms.send({
                    to: phoneNumber,
                    message: messageData.response
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.error(error);
                });
                response = "END urakoze gukoresha Horizon reba Tichet muri SMS.";
            } else {
                response = "END No ticket found!Contact ASAP"
            }
        } catch (error) {
            console.error(error);
            response = "END An error occurred.";
        }
    } else if (text === "2*1*1" || "2*1*2" || "2*1*3") {
        try {
            const messageData = await Message.findOne({ sequence: "2*1*1" || "2*1*2" || "2*1*3" });
            if (messageData) {
                sms.send({
                    to: phoneNumber,
                    message: messageData.response
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.error(error);
                });
                response = "END Thank you for Choising Horizon Check Tichet in SMS.";
            } else {
                response = "END No ticket found!Contact ASAP"
            }
        } catch (error) {
            console.error(error);
            response = "END An error occurred.";
        }
    } else if (text === "1*2*1" || "1*2*2" || "1*2*3") {
        try {
            const messageData = await Message.findOne({ sequence: "1*2*1" || "1*2*2" || "1*2*3" });
            if (messageData) {
                sms.send({
                    to: phoneNumber,
                    message: messageData.response
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.error(error);
                });
                response = "END urakoze guhitamo Volcanoes reba Tichet muri SMS.";
            } else {
                response = "END No ticket found!Contact ASAP"
            }
        } catch (error) {
            console.error(error);
            response = "END An error occurred.";
        }
    } else if (text === "2*2*1" || "2*2*2" || "2*2*3") {
        try {
            const messageData = await Message.findOne({ sequence: "2*2*1" || "2*2*2" || "2*2*3" });
            if (messageData) {
                sms.send({
                    to: phoneNumber,
                    message: messageData.response
                }).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.error(error);
                });
                response = "END Thank you for Choising Volcanoes Check Tichet in SMS.";
            } else {
                response = "END No ticket found!Contact ASAP"
            }
        } catch (error) {
            console.error(error);
            response = "END An error occurred.";
        }
    }
    res.set("Content-Type", "text/plain");
    res.send(response);
});

module.exports = router;
