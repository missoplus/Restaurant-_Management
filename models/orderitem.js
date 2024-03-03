module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
        price: {
            type: DataTypes.FLOAT, // Adjust the datatype based on your needs (FLOAT, DECIMAL, etc.)
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        QTY: {
            type: DataTypes.INTEGER, // Assuming QTY is an integer, adjust if needed
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        foodID : {
            primaryKey:true,
            type: DataTypes.INTEGER,
        },
        orderID : {
            primaryKey:true,
            type: DataTypes.INTEGER,

        }
    });

    // Define composite primary key
    OrderItem.removeAttribute('id');
    OrderItem.primaryKey = ['orderID', 'foodID'];

    OrderItem.associate = function(db){
        OrderItem.belongsTo(db['Food'], { foreignKey: 'foodID' });
        OrderItem.belongsTo(db['Order'], { foreignKey: 'orderID' });
    }

    return OrderItem;
};
