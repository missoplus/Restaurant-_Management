const Guest = require('./customer');
const Restaurant = require('./restaurant');
const Discount = require('./discount');
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            validate: {
                notEmpty: true,
            },
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT, // Adjust the datatype based on your needs (FLOAT, DECIMAL, etc.)
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        priceAfterDiscount: {
            type: DataTypes.FLOAT, // Adjust the datatype based on your needs (FLOAT, DECIMAL, etc.)
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    // Define associations with other models
    Order.associate = function(db) {
        Order.belongsTo(db['Customer'], { foreignKey: 'customerID' });
        Order.belongsTo(db['Restaurant'], { foreignKey: 'restaurantID' });
        Order.belongsTo(db['Discount'], { foreignKey: 'discountID' });
        Order.hasMany(db['OrderItem'], {
            foreignKey: 'orderID',
            onDelete: 'CASCADE',
        });
    }
    return Order;
};
