// import joi from 'joi';
const joi = require('joi');

const createUserSchema = joi.object({
    username: joi.string().min(4),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    confirm_password: joi.ref('password'),
})

const loginUserSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().min(6).required()
});
const messageSchema = joi.object({
    sequence: joi.string().required(),
    response: joi.string().required(),
    options: joi.array().items(joi.string()).optional(),
    name: joi.string().optional() // Make this optional if it's not necessary
});

module.exports = {
    loginUserSchema, messageSchema, createUserSchema
}