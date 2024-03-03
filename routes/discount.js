git init// routes/food.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const Staff = db.Staff;
const Restaurant=db.Restaurant;
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const Discount=db.Discount;
router.use(express.json());
// localhost:3000/restaurant/:restaurantId/discount
// ADD discount for restaurantId

router.post('/', async (req, res) => {
    try {
        // Assuming your request body contains necessary information for staff registration
        const {code, expireDate,startDate, amount,limit} = req.body;

        const existingDiscount = await Discount.findOne({where: {code, restaurantID: req.restaurant.id}});
        if (existingDiscount) {
            return res.status(409).json({error: 'Discount already exists with this code.'});
        }
        const t = await db.sequelize.transaction();
        const discount = await Discount.create({
          code:code,
            startDate:startDate,
            expireDate:expireDate,
            amount:amount,
            limit:limit,
            restaurantID: req.restaurant.id
        });
        const result = await req.restaurant.addDiscount(discount, {transaction: t});
        res.status(201).json({
            message: 'discount added successfully!',
            discount: discount.dataValues,
        });
        await t.commit();
    } catch (error) {
        console.error('Error during discount registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});



//READ Discounts by id
router.get('/:discountId', async (req, res) => {
    try {
        const discount = await Discount.findOne({where: {id: req.params.discountId}});
        if (discount) {
            return res.status(200).json({
                discount: discount.dataValues,
                message: 'Discount retrieved successfully'
            });
        } else {
            return res.status(500).json({
                error: "unable to get discount"
            })
        }
    } catch (error) {
        console.error('Error during discount getting:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Update discount
router.put('/:discountId', async (req, res) => {
    try {
        const {code, expireDate,startDate, amount,limit} = req.body;
        const  discount= await Discount.update({
            code:code,
            startDate:startDate,
            expireDate:expireDate,
            amount:amount,
            limit:limit,
        }, {
            where: {
                id: req.params.discountId

        },
        });
        if (discount) {
            return res.status(200).json({
                discount: discount.dataValues,
                message: 'Discount updated successfully'
            });
        } else {
            return res.status(500).json({
                error: "unable to update discount"
            })
        }
    } catch (error) {
        console.error('Error during discount updating:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Delete discount
router.delete('/:discountId', async (req, res) => {
    try {
        const discount = await Discount.destroy({
            where: {
                id: req.params.discountId
            }
        });
        if (discount) {
            return res.status(200).json(
                {
                    message: 'Discount deleted successfully'
                }
            );
        } else {
            return res.status(500).json({
                error: "unable to delete discount"
            })
        }
    } catch (error) {
        console.error('Error during discount deleting:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

module.exports = router;

