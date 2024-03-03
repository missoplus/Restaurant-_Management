module.exports = (sequelize, DataTypes) => {
    const RestaurantStaffs = sequelize.define('RestaurantStaffs', {
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });
    // RestaurantStaffs.associate = function(db) {
    //     // RestaurantStaffs.belongsTo(db['Staff'], { foreignKey: 'staffID' });
    //     // RestaurantStaffs.belongsTo(db['Restaurant'], { foreignKey: 'restaurantID' });
    // }

    // Define composite primary key
    RestaurantStaffs.removeAttribute('id');
    RestaurantStaffs.primaryKey = ['restaurantID', 'staffID'];

    return RestaurantStaffs;
};
