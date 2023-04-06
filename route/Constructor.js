const exp  = require('express')
const authorization= require('../middleWares/auth')
const ConstControllers = require("../controllers/Constructors")

class  ConstRouter{
       constructor(){
           //create main router
           this.Router = exp.Router()
           //set all endpointes
           this.setRouters()
       }
       setRouters(){
            //add controler (post method)
            this.Router.get('/get-all-constructors',ConstControllers.getAllTrainingConstructors)
       }
} 

const Router = new ConstRouter() 
module.exports  = Router.Router