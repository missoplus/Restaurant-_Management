// routes/customer.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const db= require('../models/index')
const {configDotenv} = require("dotenv");
const Order = db.Order;
const Customer = db.Customer;
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const dotenv = require('dotenv');
const jwtSecret = dotenv.config().parsed.JWT_SECRET;
router.use(express.json());

// No need to register customer, just login with email and OTP
function generateOtp(len = 6){
    //genrate random string of 6 digits
    const digits = '0123456789'
    let otp = ''
    while (otp.length < 6) {
        const charIndex = Math.floor(Math.random() * 10)
        otp += digits[charIndex]
    }
    return otp
}
router.post('/login', async (req, res) => {
    try {
        const { firstname,lastname,phone,email } = req.body;
        let customer = await Customer.findOne({ where: { email } });
        if (!customer) {
            customer = await Customer.create({
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
            });
        }
        customer.otp = generateOtp();
        await customer.save();
        res.status(200).json({
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.error('Error during customer login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//verify OTP
router.post('/verifyOTP', async (req, res) => {
    // Implementation for OTP verification for customer
    const { email, otp } = req.body;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
        return res.status(404).json({ error: 'user not found' });
    }
    if (customer.otp !== otp) {
        return res.status(401).json({ error: 'invalid otp token' });
    }
    if (customer.updatedAt < Date.now() - 5 * 60 * 1000) {
        return res.status(401).json({ error: 'otp token expired' });
    }
    customer.otp = null;
    await customer.save();
    const token = await jwt.sign({ id: customer.id }, jwtSecret, { expiresIn: '24h' });
    res.status(200).json({
        message: 'customer logged in successfully',
        token,
    });
});

module.exports = router;
