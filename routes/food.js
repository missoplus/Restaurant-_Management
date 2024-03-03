// routes/food.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const categoryOwnerMiddleware = require("../middlewares/category_owner");
const Staff = db.Staff;
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const Category = db.Category;
const Food = db.Food;
router.use(express.json());
// localhost:3000/restaurant/:restaurantId/category/:categoryId/food
// ADD Food with its category by staff with role: owner by checkOwner above middleware and take the staffId from JWT token and write a query to check this process
router.post('/', async (req, res) => {
    try {
        // Assuming your request body contains necessary information for staff registration
        const {name, price, description, parentId} = req.body;
        // Check if the food already exists
        const existingFood = await Food.findOne({where: {name, categoryId: req.category.id}});
        if (existingFood) {
            return res.status(409).json({error: 'Food already exists with this name.'});
        }
        let parentFood = null;
        if (parentId) {
            parentFood = await Food.findOne({
                where: {id: parentId}, include: [
                    {
                        "model": Category,
                        "as": "category",
                    }
                ]
            });
            if (!parentFood) {
                return res.status(400).json({error: 'Parent food not found'});
            }
            //check food restaurant is equal to category restaurant
            if (parentFood.category.restaurantID != req.restaurant.id) {
                return res.status(403).json({error: 'Forbidden'});
            }
        }
        const t = await db.sequelize.transaction();
        const food = await Food.create({
            name: name,
            price: price,
            description: description,
            parentID: parentId
        });
        const result = await req.category.addFood(food, {transaction: t});
        res.status(201).json({
            message: 'Food added successfully!',
            food: food.dataValues,
        });
        await t.commit();
    } catch (error) {
        console.error('Error during food registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});


//READ Food by id
router.get('/:foodId', async (req, res) => {
    try {
        const food = await Food.findOne({where: {id: req.params.foodId}});
        if (food) {
            return res.status(200).json({
                message: 'Food got successfully!',
                food: food.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to get food"
            })
        }
    } catch (error) {
        console.error('Error during food creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Update food
router.put('/:foodId', async (req, res) => {
    try {
        const {name, description, price} = req.body;
        const food = await Food.update({
            name: name,
            description: description,
            price: price
        }, {
            where: {
                id: req.params.foodId
            }
        });
        if (food) {
            return res.status(200).json({
                message: 'Food updated successfully!',
                food: food.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to update food"
            })
        }
    } catch (error) {
        console.error('Error during food creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Delete food
router.delete('/:foodId', async (req, res) => {
    try {
        const food = await Food.destroy({
            where: {
                id: req.params.foodId
            }
        });
        if (food) {
            return res.status(200).json({
                message: 'Food deleted successfully!'
            });
        } else {
            return res.status(500).json({
                error: "unable to delete food"
            })
        }
    } catch (error) {
        console.error('Error during food creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

module.exports = router;

