const jwt = require("jsonwebtoken");
const db = require('../models/index')
const Staff = db.Staff;
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
        const staff = await Staff.findOne({
            where: {
                id: decoded.id
            },
            include: db.Restaurant,
        });
        req.staff = staff;
        next();
    } catch (err) {
        if (err) {
            return res.status(401).json({error: 'Invalid token'});
        }
    }
};
