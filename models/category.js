const Restaurant = require('./restaurant');
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
            },
        },
    });

    // Define association with Restaurant model
    Category.associate = function (db){
        Category.belongsTo(db['Restaurant'], { foreignKey: 'restaurantID' });
        Category.hasMany(db['Food'], { foreignKey: 'categoryID' });
        //relation with gallery
        Category.hasMany(db['Gallery'], {
            foreignKey: 'categoryID',
            onDelete: 'CASCADE',
        });
    }

    return Category;
};
