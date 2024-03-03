//middlewares
const express= require('express');
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const userRoute = require('./routes/staff');
const categoryRoute = require('./routes/category');
const RestaurantRoute = require('./routes/restaurant');
const foodRoute = require('./routes/food');
const discRoute = require('./routes/discount');
const galleryRoute=require('./routes/gallery');
const orderRoute=require('./routes/order');
const bodyParser = require('body-parser');
const customerRoute = require('./routes/customer');
const verifyStaffMiddleware = require('./middlewares/verify_staff');
const verifyCustomerMiddleware = require('./middlewares/verify_customer');
const restaurantOwnerMiddleware = require('./middlewares/restaurant_owner');
const categoryOwnerMiddleware = require('./middlewares/category_owner');
const discountOwnerMiddleware=require('./middlewares/discount_owner');
const galleryOwnerMiddleware=require('./middlewares/gallery_check');
const OrderCheckMiddleware=require('./middlewares/order_check');
//const orderOwnerMiddleware=require('./middlewares/order_owner');
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
require('dotenv').config();
const db=require('./models');
const cors=require('cors');
app.use(cors());
app.use(cookieParser());

//routes
//OWNER
app.use('/staff', userRoute);
app.use('/restaurant', verifyStaffMiddleware,RestaurantRoute);
app.use('/restaurant/:restaurantId/category',verifyStaffMiddleware,restaurantOwnerMiddleware, categoryRoute);
app.use('/restaurant/:restaurantId/category/:categoryId/food',verifyStaffMiddleware,restaurantOwnerMiddleware,categoryOwnerMiddleware, foodRoute);
app.use('/restaurant/:restaurantId/discount',verifyStaffMiddleware,restaurantOwnerMiddleware,discountOwnerMiddleware, discRoute);
app.use('/category/:categoryId/food/:foodId/gallery',galleryOwnerMiddleware, galleryRoute);

//CUSTOMER
//Customer Authentication
app.use('/customer', customerRoute);

//Get Customer Orders
//app.post('/customer/order/:restaurantId',verifyCustomerMiddleware);

db.sequelize.sync().then((req)=>{
    app.listen(process.env.PORT,()=>{
        console.log('server is running on port 3000');
    });
}).catch(function (e) {
    console.error(e);
});
