//check the staff role is owner or not
const db = require('../models/index')
const Staff = db.Staff;
const Restaurant = db.Restaurant;
const Op = db.sequelize.Op;
const dotenv = require('dotenv');
module.exports = async (req, res, next) => {
//check the staff role is owner or not from staff table
    const restaurant = await Restaurant.findOne({
        where: {
            id: req.params.restaurantId
        },
        include: [db.Staff, db.Category],
    });
    const isOwner = restaurant.Staffs.some(staff => staff.id === req.staff.id && staff.RestaurantStaffs.role === 0);
    if (isOwner) {
        req.restaurant = restaurant;
        next();
    } else {
        return res.status(403).json({error: 'Forbidden'});
    }


};