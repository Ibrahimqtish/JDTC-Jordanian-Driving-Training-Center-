const exp  = require('express')
const authorization= require('../middleWares/auth')
const trainingControllers = require("../controllers/TrainingCenters")

class  TrainingCentersRouter{
       constructor(){
           //create main router
           this.Router = exp.Router()
           //set all endpointes
           this.setRouters()
       }
       setRouters(){
            //add controler (post method)
            this.Router.post('/add-training-center',trainingControllers.addTrainingCenter)
            this.Router.get('/getAllTrainingCenters',trainingControllers.getAllTrainingCenters)
            this.Router.post('/add-training-images',trainingControllers.upload_product_pictures)
            this.Router.get('/get-trainingCenter-by-id/:id',trainingControllers.getTraningCenterById)
            this.Router.put('/edit-training-center/:id',trainingControllers.editTrainingCenter)
            this.Router.delete('/delete-center/:id',trainingControllers.deleteCenter)
            this.Router.get('/getMusicList',trainingControllers.getMusicList)
            this.Router.post('/submit-review',authorization,trainingControllers.SubmitReview)
            this.Router.get('/getAllCenterReviews/:center_id',trainingControllers.getAllCenterReviews)
       }
}

const Router = new TrainingCentersRouter() 
module.exports  = Router.Router