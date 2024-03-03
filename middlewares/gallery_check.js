
const db = require('../models/index')
const Category = db.Category;
const Restaurant = db.Restaurant;
const Food = db.Food;
const Gallery=db.Gallery
const Op = db.sequelize.Op;
const dotenv = require('dotenv');

module.exports = async (req, res, next) => {
    try {
        const { categoryId, foodId } = req.params;

        // Ensure categoryId and foodId are defined and are valid numbers
        if (!categoryId || isNaN(categoryId) || !foodId || isNaN(foodId)) {
            return res.status(400).json({ error: 'Invalid category or food ID' });
        }

        // Find the category by ID
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Find the food by ID
        const food = await Food.findByPk(foodId);

        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        // Check if the food has a gallery associated with it
        const gallery = await Gallery.findOne({ where: { foodId: foodId } });

        // Attach the category, food, and gallery to the request object
        req.category = category;
        req.food = food;
        req.gallery = gallery;

        // Continue processing the request
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};