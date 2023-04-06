//import file called .env    //.env لجلب ملف يدغى  
//ملف يخزن متغيارت خاصة في بيئة التشغيل
require('dotenv').config()
const path = require('path')

//import routers لجلب الموجهات
const Products = require('./route/products')
const Users = require('./route/users')
const userfunctions = require('./route/userFunctions')
const {OrdersRouter} = require('./route/order')
const {AppRouter} = require('./route/app')
const TrainingCenter = require('./route/TrainingCenters')
const CarsRouter = require('./route/Car')
const ConstructorsRouter = require('./route/Constructor')
const ImageRouter=require('./route/Image')
//import file for connect to the database 
const {conntect} = require('./modules/database')
//import libraries required or server operations جلب المكتبات الخاصة في تشغيل السيرفر 
//JWT is library used or sign authentication key هي مكتبة مخصصة لتوقيع او لأنشاء مفتاح للمستخدم
const jwt = require('jsonwebtoken')
// 
const cookieParser = require('cookie-parser') 
//this is a library used for handel file uploading to the server
const uploadFile = require ('express-fileupload')
//used for policy issus
const cors = require('cors')
//this is a library called express which is a frame work used for creating
//server 
const express = require('express')
//Init Class 
class Server{
    //called once the object created
    constructor(){
          //create new object from express        
          this.app = express()
          //Add MiddelWares
          this.app.use(cors());
          this.app.use(cookieParser());
          this.app.use(uploadFile({createParentPath : true}));
          this.app.use('/images', express.static('images'))
          //Set Routers
        //   this.app.use('/images/*',express.json(), ImageRouter)
          this.app.use('/api/v1/courses',express.json(),  Products)
          this.app.use('/api/v1/users' ,express.json(), Users)
          this.app.use('/api/v1/userfunctions',express.json() , userfunctions)
          this.app.use('/api/v1/app',express.json(), AppRouter)
          this.app.use('/api/v1/order' , OrdersRouter)
          this.app.use('/api/v1/centers',express.json(),TrainingCenter)
          this.app.use('/api/v1/cars',express.json(),CarsRouter)
          this.app.use('/api/v1/constructros',express.json(),ConstructorsRouter)
    }
    //Connect to the database and start the server
    StartServer(port){
          //Connect to Database
          conntect().then(() =>{
              //Start Server
              //listen is method used for start the server
              //and listen to HTTP requiests 
              this.app.listen(port , ()=>{
                  console.log(`Server has been Started | Port ${port}`)
              }) 
              console.log('succsess')
          }).catch( (err)=>{
              console.log(err)
          })
    }
}
//INIT Server
const server = new Server()
server.StartServer(5000)
