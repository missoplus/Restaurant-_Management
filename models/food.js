module.exports = (sequelize, DataTypes) => {
    const Food = sequelize.define('Food', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT, // Adjust the datatype based on your needs (TEXT, STRING, etc.)
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
        price: {
            type: DataTypes.FLOAT, // Adjust the datatype based on your needs (FLOAT, DECIMAL, etc.)
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },


    });

    // Define association for parent food
    Food.associate = function(db){
        Food.belongsTo(db['Food'], { foreignKey: 'parentID', as: 'parentFood'});
        Food.belongsTo(db['Category'], {
            foreignKey: 'categoryID',
            as: 'category',
        });
        //relation with gallery
        Food.hasMany(db['Gallery'], {
            foreignKey: 'foodID',
            onDelete: 'CASCADE',
        });
        //relation with OrderItem
        Food.hasMany(db['OrderItem'], {
            foreignKey: 'foodID',
            onDelete: 'CASCADE',
        });
    }
    return Food;
};
