//import file called .env    //.env لجلب ملف يدغى  
//ملف يخزن متغيارت خاصة في بيئة التشغيل
require('dotenv').config()
const path = require('path')
const SMTPServer = require("smtp-server").SMTPServer;
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
const QuastionsRouter=require('./route/Quastion')
//import file for connect to the database 
const {conntect} = require('./modules/database')
const bodyParser = require("body-parser")
const swaggerJsdoc = require("swagger-jsdoc")

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
          this.app.use('*',cors());
          this.app.use(cookieParser());
          this.app.use(uploadFile({createParentPath : true}));
          this.app.use('/images', express.static('images'))
          //Set Routers
          //this.app.use('/images/*',express.json(), ImageRouter)
          this.app.use('/api/v1/quastions',express.json(), QuastionsRouter)
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
          }).catch((err)=>{
              console.log(err)
          })
    }
}
// INIT Server
const server = new Server()
server.StartServer(5000)


// const form_data = new FormData()
// form_data.append('email',"sdkof@test.com")
// form_data.append('phone_number','12312')
// form_data.append('name',"wajdi")

// fetch('https://api.mooneh.net/vendor/v1.0/edit_profile?vendor_id=1',{method:'PUT' , body:form_data,
// headers:{'Authorization':'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IktGQyIsImV4cCI6MTY4MzAyNzI4Nn0.fRr17e5mNLKNJiAVgXiNsS29vIlplXjm17cJF1awfIpBTNXR2bx---y90ekyz-va9Zn2hLPso6ZzxAIIfue1vHuXUwJcyLn0ocdcWl0Gjg7fVE9fBLI_gCKH3MaE4IAYQtkGaFadSKJzZXmawarN54j83JIOhavl0xoWZR4UbW8',
//          'channel':'ios'
// }}).then(res=>{
//     if (res.status == 200){
//             console.log("accepted")
//             return res.json()
//     }else{
//         console.log("rejected")
//         console.log(res)
//         return res.json()
//     }
// }).then(res=>{
//     console.log(res)
// })

// const number_of_sessions=(10 * (24 * 60 * 60 * 1000))
// const taken_start_date = Date.parse('1996-06-04T00:00:00.000+00:00')
// const taken_end_date=taken_start_date + number_of_sessions

// const order_time=();

// console.log(taken_start_date)
// console.log(taken_end_date)