const exp  = require('express')
const {authorization}= require('../middleWares/auth')
const CarsControllers = require("../controllers/Car")

class  CarRouter{
       constructor(){
           //create main router
           this.Router = exp.Router()
           //set all endpointes
           this.setRouters()
       }
       setRouters(){
            //add controler (post method)
            this.Router.get('/get-car',        CarsControllers.getCar)
            this.Router.post('/add-car',       CarsControllers.addCar)
            this.Router.post('/upload-images', CarsControllers.upload_product_pictures)
            this.Router.get("/get-all-cars",CarsControllers.getAllTrainingCars)
            this.Router.delete('/delete/:id',authorization,CarsControllers.deleteCare)
            this.Router.get('/get-car-by-id/:id',CarsControllers.getCarById)
            this.Router.put('/EditCar/:id',CarsControllers.EditCar)
       }
}

const Router = new CarRouter()
module.exports  = Router.Router