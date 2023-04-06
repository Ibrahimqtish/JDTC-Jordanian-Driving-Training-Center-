//import express framwork
const exp  = require('express')
//import controllers
const {Images} = require('../controllers/Images')

authorization=require('../middleWares/auth')
//Router Class
class ImageRouter{
  constructor(){
        //init router
        this.router = exp.Router()
        this.setRouters()
  }
  setRouters(){
            //get products by category
            this.router.get('/', Images)
  }
}
const router = new ImageRouter() 
module.exports  = router.router