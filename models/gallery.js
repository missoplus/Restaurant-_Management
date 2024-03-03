module.exports = (sequelize, DataTypes) => {
    const Gallery = sequelize.define('Gallery', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    // Define associations with other models
    Gallery.associate = function(db){
        Gallery.belongsTo(db['Food'], { foreignKey: 'foodID' });
        Gallery.belongsTo(db['Category'], { foreignKey: 'categoryID' });
    }
    return Gallery;
};
