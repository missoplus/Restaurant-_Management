// routes/category.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const Staff = db.Staff; // inja ham modele Staff o dari az too class e database import mikoni
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const Category = db.Category; // inja ham modele Staff o dari az too class e database import mikoni
router.use(express.json());
// localhost:3000/restaurant
// ADD Category with its restaurant by staff with role: owner by checkOwner above middleware and take the staffId from JWT token and write a query to check this process
router.post('/',async (req, res) => {
    try {
        // Assuming your request body contains necessary information for staff registration
        const {name} = req.body;
        // Check if the category already exists
        const existingCategory = await Category.findOne({where: {name, restaurantID: req.restaurant.id}});
        if (existingCategory) {
            return res.status(409).json({error: 'Category already exists with this name.'});
        }
        const t = await db.sequelize.transaction();
        const category = await Category.create({
            name: name
        },{transaction : t });
        const result = await  req.restaurant.addCategory(category,{transaction:t});
        res.status(201).json({
            message: 'Category added successfully!',
            category: category.dataValues,
        });
        await t.commit();
    } catch (error) {
        console.error('Error during category registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// READ category by id
router.get('/:categoryId', async (req, res) => {
    try {
        const category = await Category.findOne({where: {id: req.params.categoryId}});
        if (category) {
            return res.status(200).json({
                message: 'category got successfully!',
                category: category.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to get category"
            })
        }
    } catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Update category
router.put('/:categoryId', async (req, res) => {
    try {
        const {name} = req.body;
        const category = await Category.update({
            name: name
        }, {
            where: {
                id: req.params.categoryId
            }
        });
        if (category) {
            return res.status(200).json({
                message: 'category updated successfully!',
                category: category.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to update category"
            })
        }
    } catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Delete category
router.delete('/:categoryId', async (req, res) => {
    try {
        const category = await Category.destroy({
            where: {
                id: req.params.categoryId
            }
        });
        if (category) {
            return res.status(200).json({
                message: 'category deleted successfully!',
            });
        } else {
            return res.status(500).json({
                error: "unable to delete category"
            })
        }
    } catch (error) {
        console.error('Error during category creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

module.exports = router;

