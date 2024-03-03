module.exports = (sequelize, DataTypes) => {
    const Discount = sequelize.define('Discount', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        expireDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT, // Adjust the datatype based on your needs (FLOAT, DECIMAL, etc.)
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        limit: {
            type: DataTypes.INTEGER, // Assuming limit is an integer, adjust if needed
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });
    Discount.associate = function (db){
        Discount.hasMany(db['Order'], {
            foreignKey: 'discountID',
            onDelete: 'CASCADE',
        });
        Discount.belongsTo(db['Restaurant'], {
            foreignKey: 'restaurantID',
            onDelete: 'CASCADE',
        });

    }
    return Discount;
};
