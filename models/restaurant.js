const Staff = require('./staff');
const RestaurantStaffs = require('./restaurant_staffs');
module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
    });

    Restaurant.associate = function(db) {
        Restaurant.belongsToMany(db['Staff'],{
            through : db['RestaurantStaffs']
        });
        Restaurant.hasMany(db['Order'], {
            foreignKey: 'restaurantID',
            onDelete: 'CASCADE',
        });
        Restaurant.hasMany(db['Category'], {
            foreignKey: 'restaurantID',
            onDelete: 'CASCADE',
        });
        Restaurant.hasMany(db['Discount'], {
            foreignKey: 'restaurantID',
            onDelete: 'CASCADE',
        });
    }
    return Restaurant;
};
