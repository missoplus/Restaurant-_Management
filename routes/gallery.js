// routes/category.js
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your-jwt-secret-key';
const router = express.Router();
const db = require('../models/index')
const Staff = db.Staff; // inja ham modele Staff o dari az too class e database import mikoni
const Op = db.sequelize.Op; // ino badan lazemet mishe vase operation ha mese GT , LT , EQ , ...
const Category = db.Category;
const Food = db.Food;
const Restaurant = db.Restaurant;
const Gallery= db.Gallery;
router.use(express.json());
// localhost:3000/restaurant
// ADD Gallery with its restaurant and category
router.post('/',async (req, res) => {
    try {
        const {image,description} = req.body;
        // Check if the gallery already exists
        const existingGallery = await Gallery.findOne({where: {description,categoryID:req.category.id,foodID:req.food.id}});
        if (existingGallery) {
            return res.status(409).json({error: 'Gallery already exists with this image.'});
        }
        const t = await db.sequelize.transaction();
        const gallery = await Gallery.create({
            image: image,
            description:description,
            foodID: req.food.id,
            categoryID:req.category.id
        },{transaction : t });
        const result = await  req.food.addGallery(gallery,{transaction:t});
        res.status(201).json({
            message: 'Gallery added successfully!',
            gallery: gallery.dataValues,
        });
        await t.commit();
    } catch (error) {
        console.error('Error during gallery registration:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// READ gallery by id
router.get('/:galleryId', async (req, res) => {
    try {
        const gallery = await Gallery.findOne({where: {id: req.params.galleryId}});
        if (gallery) {
            return res.status(200).json({
                message: 'gallery got successfully!',
                gallery: gallery.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to get gallery"
            })
        }
    } catch (error) {
        console.error('Error during gallery creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Update gallery
router.put('/:galleryId', async (req, res) => {
    try {
        const {image,description} = req.body;
        const gallery = await Gallery.update({
            image: image,
            description:description,
        }, {
            where: {
                id: req.params.galleryId
            }
        });
        if (gallery) {
            return res.status(200).json({
                message: 'gallery updated successfully!',
                gallery: gallery.dataValues,
            });
        } else {
            return res.status(500).json({
                error: "unable to update gallery"
            })
        }
    } catch (error) {
        console.error('Error during gallery creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

// Delete gallery
router.delete('/:galleryId', async (req, res) => {
    try {
        const gallery = await Gallery.destroy({
            where: {
                id: req.params.galleryId
            }
        });
        if (gallery) {
            return res.status(200).json({
                message: 'gallery deleted successfully!',
            });
        } else {
            return res.status(500).json({
                error: "unable to delete gallery"
            })
        }
    } catch (error) {
        console.error('Error during gallery creation:', error);
        res.status(500).json({error: 'Internal server error'});
    }

});

module.exports = router;

