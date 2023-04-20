//import express framwork
const exp  = require('express')
//import controllers
const {getAllProducts, 
      getCourse,
      addCourse,
      editeProduct,
      deleteProduct,myCourses,
      upload_coures_pictures,
      getUserProducts,getCoursesByCenterId,
      editCourse} = require('../controllers/products')

authorization= require('../middleWares/auth')
//Router Class
class ProductRouter{
  constructor(){
        //init router
        this.router = exp.Router()
        this.setRouters()
  }
  setRouters(){
            //get products by category
            this.router.get('/store/*', getAllProducts)
            //get all products
            this.router.get('/', getAllProducts)
            this.router.get('/getUserProducts',authorization,getUserProducts)
            //get product by ID
            this.router.get('/course/:courseId', getCourse)
            //add product
            this.router.post('/addCourse',  addCourse)
            //add product picturs
            this.router.post('/addcouresimages',  upload_coures_pictures)
            //edit product
            this.router.delete('/deleteproduct/:productId',authorization, deleteProduct)           
            this.router.put('/editCourse/:id',editCourse)
            this.router.get('/mycourses',authorization,myCourses)
            this.router.get('/get-courses-by-center-id/:id',getCoursesByCenterId)
  }
}
const router = new ProductRouter() 
module.exports  = router.router