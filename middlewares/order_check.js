
const db = require('../models/index');
const Restaurant = db.Restaurant;
const Discount = db.Discount;
const Order = db.Order;
const Customer = db.Customer;
const Op = db.sequelize.Op;
const dotenv = require('dotenv');

module.exports = async (req, res, next) => {
    try {
        const { restaurantId, discountId, customerId } = req.params;

        if (!restaurantId || isNaN(restaurantId) || !discountId || isNaN(discountId) || !customerId || isNaN(customerId)) {
            return res.status(400).json({ error: 'Invalid restaurant, discount, or customer ID' });
        }

        // Find the restaurant by ID
        const restaurant = await Restaurant.findByPk(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Find the discount by ID
        const discount = await Discount.findByPk(discountId);

        if (!discount) {
            return res.status(404).json({ error: 'Discount not found' });
        }

        // Find the customer by ID
        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Check if the discount has an order associated with it
        const order = await Order.findOne({ where: { discountId: discountId, customerId: customerId } });

        // Attach the restaurant, customer, discount, and order to the request object
        req.restaurant = restaurant;
        req.customer = customer;
        req.discount = discount;
        req.order = order;

        // Continue processing the request
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};