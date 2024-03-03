const db = require('../models/index')
const Discount = db.Discount;
const Restaurant = db.Restaurant;
const Op = db.sequelize.Op;
const dotenv = require('dotenv');
const {where} = require("sequelize");
//check the discount of restaurant to pass for router to add discount
module.exports = async (req, res, next) => {
    //write a middleware to check the discount of restaurantID to pass for router to add discount
    try {
        // Ensure req.params.restaurantId is defined and is a valid number
        const restaurantId = req.params.restaurantId;
        if (!restaurantId || isNaN(restaurantId)) {
            return res.status(400).json({ error: 'Invalid restaurant ID' });
        }

        // Find the restaurant by ID
        const restaurant = await Restaurant.findOne({ where: { id: restaurantId } });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Check if the restaurant has a discount associated with it
        const discount = await Discount.findOne({ where: { restaurantId: restaurantId } });

        // Attach the discount to the request object for further use in the router
        req.discount = discount;

        // Continue processing the request
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}