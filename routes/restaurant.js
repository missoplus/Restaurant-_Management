// routes/restaurant.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const restaurantOwnerMiddleware = require("../middlewares/restaurant_owner");
const Staff = db.Staff;
const Restaurant = db.Restaurant; // inja ham modele o dari az too class e database import mikoni
const RestaurantStaffs = db.RestaurantStaffs;
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
router.use(express.json());

//middleware to check that a person who logged in is for this restaurant or not and after that check the role is owner

// ADD Restaurant by staff with role: owner by checkOwner above middleware and take the staffId from JWT token and write a query to check this process
// localhost:3000/restaurant
router.post('/',async (req, res) => {
    try {
        // Assuming your request body contains necessary information for staff registration
        const {name} = req.body;
        // Check if the restaurant already exists
        const existingRestaurant = await Restaurant.findOne({where: {name}});
        if (existingRestaurant) {
            return res.status(409).json({error: 'Restaurant already exists with this name.'});
        }
        const t = await db.sequelize.transaction();
        try {
            const restaurant = await Restaurant.create({
                name: name
            },{transaction : t });
            const staff = req.staff;
            // const restaurantStaff = await RestaurantStaffs.create({
            //     RestaurantId: restaurant.id,
            //     StaffId: staff.id,
            //     role: 0, //defaults to owner because he is the creator
            // });
            await staff.addRestaurant(restaurant, {through: {role: 0},transaction:t}); //defaults to owner because he is the creator
           // await restaurant.addStaff(staff, {through: {role: 0}}); //defaults to owner because he is the creator
            await t.commit();
            res.status(201).json({
                message: 'Restaurant added successfully!',
                restaurant: restaurant.dataValues,
            });
        } catch (e) {
            t.rollback();
            res.status(500).json({
                message: 'unable to create restaurant',
                err: e.message,
            });
        }
        // const restaurant = await Restaurant.create({ name: 'restaurant' });
        // const staff = await Staff.findOne({where: {id: req.staff.id}});
        // staff.addRestaurant = async function (restaurant) {
        //     await RestaurantStaffs.create({ RestaurantId: restaurant.id, StaffId: this.id });
        // }
        // await staff.addRestaurant(restaurant);
    } catch (error) {
        console.error('Error during restaurant registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// READ restaurant by id
// localhost:3000/restaurant/1
router.get('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
        if (restaurant) {
            return res.status(200).json({
                message: 'restaurant got successfully!',
                restaurant: restaurant.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to get restaurant"
            })
        }
    } catch (error) {
        console.error('Error during restaurant creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});
//Add staff member to restaurant by giving role and email and check the staff added is owner or not
// localhost:3000/restaurant/:restaurantId/Staff
router.post('/:restaurantId/staff',restaurantOwnerMiddleware, async (req, res) => {
    try {
        const {email, role} = req.body;
        const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
        if (restaurant) {
            const staff = await Staff.findOne({where: {email}});
            if (staff) {
                // const restaurantStaff = await RestaurantStaffs.create({
                //     RestaurantId: restaurant.id,
                //     StaffId: staff.id,
                //     role: role,
                // });
                await restaurant.addStaff(staff, {through: {role: role}});
                return res.status(200).json(staff);
            } else {
                return res.status(500).json({
                    error: "unable to add staff"
                })
            }
        } else {
            return res.status(500).json({
                error: "unable to add staff"
            })
        }
    } catch (error) {
        console.error('Error during restaurant creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


// Update restaurant by role=owner and check the restaurant is owner or not
// localhost:3000/restaurant/1
router.put('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
    try {
        const {name} = req.body;
        const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
        if (restaurant) {
            restaurant.name = name;
            await restaurant.save();
            return res.status(200).json({
                message: 'restaurant updated successfully!',
                restaurant: restaurant.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to update restaurant"
            })
        }
    } catch (error) {
        console.error('Error during restaurant creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


// Delete restaurant
router.delete('/:restaurantId',restaurantOwnerMiddleware, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({where: {id: req.params.restaurantId}});
        if (restaurant) {
            await restaurant.destroy();
            return res.status(200).json({
                message: 'restaurant deleted successfully!',
            });
        } else {
            return res.status(500).json({
                error: "unable to delete restaurant"
            })
        }
    } catch (error) {
        console.error('Error during restaurant creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

module.exports = router;

