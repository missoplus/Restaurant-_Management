// models/staff.js

const bcrypt = require('bcrypt');
const RestaurantStaffs = require('./restaurant_staffs');
module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            set(value) {
                // Hash and salt the password before saving
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true, // Check if it's a valid email address
            },
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
            },
        }
    },{
        indexes: [
            {
                unique: true,
                fields: ['email'],
            },
        ]
    });
    Staff.associate = function(db){
        Staff.belongsToMany(db['Restaurant'], {
            through : db['RestaurantStaffs']
        });
    }
    return Staff;
};

