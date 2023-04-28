//import express framwork
const exp  = require('express')
//import controllers
const {getAllProducts, 
      getCourse,
      addCourse,
      editeProduct,
      deleteProduct,myCourses,
      upload_coures_pictures,DeleteCourseById,
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
            this.router.get('/store/*', getAllProducts)
            this.router.get('/', getAllProducts)
            this.router.get('/getUserProducts',authorization,getUserProducts)
            this.router.get('/course/:courseId', getCourse)
            this.router.post('/addCourse',  addCourse)
            this.router.post('/addcouresimages',  upload_coures_pictures)
            this.router.delete('/deleteproduct/:productId',authorization, deleteProduct)           
            this.router.put('/editCourse/:id',editCourse)
            this.router.get('/mycourses',authorization,myCourses)
            this.router.get('/get-courses-by-center-id/:id',getCoursesByCenterId)
            this.router.delete('/deleteCourseById/:id',DeleteCourseById)
  }
}
const router = new ProductRouter() 
module.exports  = router.router