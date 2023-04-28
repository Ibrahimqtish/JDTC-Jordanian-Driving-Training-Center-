const exp  = require('express')
const authorization= require('../middleWares/auth')
const QuastionBank = require("../controllers/QuastionBank")

class  QustionBank{
       constructor(){
           //create main router
           this.Router = exp.Router()
           //set all endpointes
           this.setRouters()
       }
       setRouters(){
            //add controler (post method)
            this.Router.post('/add-quastion-bank',QuastionBank.AddQuastionsBank)
            this.Router.post('/add-quastions'    ,QuastionBank.AddQuastions)
            this.Router.post('/add-exam'         ,QuastionBank.addExam)
            this.Router.post('/submitExam'       ,authorization,QuastionBank.SubmitAnswers)
            this.Router.get('/get-quastion-banks',QuastionBank.getQuastionsBanks)
            this.Router.get('/get-quastions'     ,QuastionBank.getQuastions)
            this.Router.get('/get-quastion/:id'  ,QuastionBank.getQuastionByID)
            this.Router.get('/get-exams'         ,QuastionBank.getExams)
            this.Router.get('/get-native-exams-by-id/:examId',QuastionBank.getNativeExamById)
            this.Router.get('/get-exams-by-id/:examId' ,QuastionBank.getExamById)
            this.Router.get('/get-exam-by-course/:courseId',QuastionBank.getExamByCourse)
            this.Router.put('/edit-quastions/:id',QuastionBank.EditQuastions)
            this.Router.put('/edit-exam/:id',QuastionBank.EditExam)
            this.Router.get('/getExamResulte/:examId',authorization,QuastionBank.getExamResulte)
            this.Router.get('/getBankById/:id',QuastionBank.getBankByID)
            this.Router.put('/edit-quastion-bank/:id',QuastionBank.EditQuastionsBank)
       }
}

const Router = new QustionBank() 
module.exports  = Router.Router