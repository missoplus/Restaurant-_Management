
const db = require('../models/index')
const Category = db.Category;
const Restaurant = db.Restaurant;
const Op = db.sequelize.Op;
const dotenv = require('dotenv');
module.exports = async (req, res, next) => {
//check the category of restaurant to pass for router to add category
    const category = await req.restaurant.Categories.find(category => category.id == req.params.categoryId);
    if (category) {
        req.category = category;
        next();
    } else {
        return res.status(403).json({error: 'Forbidden'});
    }

};