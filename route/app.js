//app router
const AppRouter = require('express').Router()
//Application Controllers
const {App} = require('../controllers/Applications')

const {authorization} = require('../middleWares/auth')
const Apple = new App() 
//get order
AppRouter.post('/addapp',authorization,Apple.AddApplication)
AppRouter.get('/getapp',authorization,Apple.getApplications)

module.exports = {AppRouter}
