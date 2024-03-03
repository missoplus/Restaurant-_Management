// routes/staff.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const db= require('../models/index')
const {configDotenv} = require("dotenv");
const Staff = db.Staff; // inja ham modele Staff o dari az too class e database import mikoni
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const dotenv = require('dotenv');
const jwtSecret = dotenv.config().parsed.JWT_SECRET;

router.use(express.json());

// Register
router.post('/signup', async (req, res) => {
    try {
        // Assuming your request body contains necessary information for staff registration
        const { fullname, email, password } = req.body;

        // Check if the staff already exists
        const existingStaff = await Staff.findOne({ where: { email } });
        if (existingStaff) {
            return res.status(409).json({ error: 'Staff already exists with this email.' });
        }
        const staff = await Staff.create({
            fullname: fullname,
            email: email,
            password: password,
            role: 0, // owner
        });
        if (staff){
            return res.status(200).json(staff.dataValues);
        }else{
            return res.status(500).json ({
                error: "unable to create user"
            })
        }


        res.status(201).json({
            message: 'Staff registered successfully!',
            staff: staff.dataValues,
        });
    } catch (error) {
        console.error('Error during staff registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Middleware to verify JWT
 // Login
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
router.post('/login/otp', async (req, res) => {
    try {
        const { email } = req.body;
        const staff = await Staff.findOne({ where: { email } });
        if (!staff) {
            return res.status(404).json({ error: 'user not found' });
        }
        // Generate and send OTP
        staff.otp = generateOtp();

        await staff.save();
        res.status(200).json({
            message: 'OTP sent successfully',
        });
    } catch (error) {
        console.error('Error during staff login:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
});
router.post('/login', async (req, res) => {
    try {
        const { email , password } = req.body;
        const staff = await Staff.findOne({ where: { email } });
        if (!staff) {
            return res.status(404).json({ error: 'user not found' });
        }
        const isValidPassword = await bcrypt.compare(password, staff.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'invalid password' });
        }
        const token = await jwt.sign({ id: staff.id }, jwtSecret, { expiresIn: '24h' });
        res.status(200).json({
            message: 'Staff logged in successfully',
            token,
        });
    } catch (error) {
        console.error('Error during staff login:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
});

//verify OTP
router.post('/verifyOTP', async (req, res) => {
    // Implementation for OTP verification for staff
    const { email, otp } = req.body;
    const staff = await Staff.findOne({ where: { email } });
    if (!staff) {
        return res.status(404).json({ error: 'user not found' });
    }
    if (staff.otp !== otp) {
        return res.status(401).json({ error: 'invalid otp token' });
    }
    if (staff.updatedAt < Date.now() - 5 * 60 * 1000) {
        return res.status(401).json({ error: 'otp token expired' });
    }
    staff.otp = null;
    await staff.save();
    const token = await jwt.sign({ id: staff.id }, jwtSecret, { expiresIn: '24h' });
    res.status(200).json({
        message: 'Staff logged in successfully',
        token,
    });
});

module.exports = router;
