const jwt = require("jsonwebtoken");
const db = require('../models/index')
const Customer = db.Customer;
const Order = db.Order;
const Op = db.sequelize.Op;
const dotenv = require('dotenv');
const jwtSecret = dotenv.config().parsed.JWT_SECRET;

module.exports = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    try {
        const decoded = await jwt.verify(token, jwtSecret);
        const customer = await Customer.findOne({
            where: {
                id: decoded.id
            },
            include: db.Order,
        });
        req.customer = customer;
        next();
    } catch (err) {
        if (err) {
            return res.status(401).json({error: 'Invalid token'});
        }
    }
};