// routes/restaurant.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const restaurantOwnerMiddleware = require("../middlewares/restaurant_owner");
const Customer = db.Customer;
const Discount = db.Discount;
const Restaurant = db.Restaurant;
const Order= db.Order;
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
router.use(express.json());


// ADD Order by customer
// localhost:3000/restaurant/:restaurantId/discount/:discountId/order
router.post('/',async (req, res) => {
    try {
        const {date,price} = req.body;
        const existingOrder = await Order.findOne({where: {date,restaurantID:req.restaurant.id,discountID:req.discount.id,customerID:req.customer.id}});
        if (existingOrder) {
            return res.status(409).json({error: 'Order already exists with this date.'});
        }
        const t = await db.sequelize.transaction();
        const order = await Order.create({
            date: date,
            price:price,
            priceAfterDiscount: price-(price*req.discount.discountPercentage/100),
            restaurantID: req.restaurant.id,
            discountID:req.discount.id,
            customerID:req.customer.id
        },{transaction : t });
        const result = await  req.discount.addOrder(order,{transaction:t});
        res.status(201).json({
            message: 'order added successfully!',
            order: order.dataValues,
        });
        await t.commit();
    } catch (error) {
        console.error('Error during order registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


// READ restaurant by id
// localhost:3000/restaurant/1
// router.get('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
//     try {
//         const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
//         if (restaurant) {
//             return res.status(200).json({
//                 message: 'restaurant got successfully!',
//                 restaurant: restaurant.dataValues,
//             });
//         } else {
//             return res.status(500).json({
//                 error: "unable to get restaurant"
//             })
//         }
//     } catch (error) {
//         console.error('Error during restaurant creation:', error);
//         res.status(500).json({error: 'Internal server error'});
//     }
// });
// //Add staff member to restaurant by giving role and email and check the staff added is owner or not
// // localhost:3000/restaurant/:restaurantId/Staff
// router.post('/:restaurantId/staff',restaurantOwnerMiddleware, async (req, res) => {
//     try {
//         const {email, role} = req.body;
//         const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
//         if (restaurant) {
//             const staff = await Staff.findOne({where: {email}});
//             if (staff) {
//                 // const restaurantStaff = await RestaurantStaffs.create({
//                 //     RestaurantId: restaurant.id,
//                 //     StaffId: staff.id,
//                 //     role: role,
//                 // });
//                 await restaurant.addStaff(staff, {through: {role: role}});
//                 return res.status(200).json(staff);
//             } else {
//                 return res.status(500).json({
//                     error: "unable to add staff"
//                 })
//             }
//         } else {
//             return res.status(500).json({
//                 error: "unable to add staff"
//             })
//         }
//     } catch (error) {
//         console.error('Error during restaurant creation:', error);
//         res.status(500).json({error: 'Internal server error'});
//     }
// });
//
//
// // Update restaurant by role=owner and check the restaurant is owner or not
// // localhost:3000/restaurant/1
// router.put('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
//     try {
//         const {name} = req.body;
//         const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
//         if (restaurant) {
//             restaurant.name = name;
//             await restaurant.save();
//             return res.status(200).json({
//                 message: 'restaurant updated successfully!',
//                 restaurant: restaurant.dataValues,
//             });
//         } else {
//             return res.status(500).json({
//                 error: "unable to update restaurant"
//             })
//         }
//     } catch (error) {
//         console.error('Error during restaurant creation:', error);
//         res.status(500).json({error: 'Internal server error'});
//     }
// });
//
//
// // Delete restaurant
// router.delete('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
//     try {
//         const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
//         if (restaurant) {
//             await restaurant.destroy();
//             return res.status(200).json({
//                 message: 'restaurant deleted successfully!',
//             });
//         } else {
//             return res.status(500).json({
//                 error: "unable to delete restaurant"
//             })
//         }
//     } catch (error) {
//         console.error('Error during restaurant creation:', error);
//         res.status(500).json({error: 'Internal server error'});
//     }
// });

module.exports = router;

