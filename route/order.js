const bodyparser = require('body-parser')

const OrdersRouter = require('express').Router()
const {pursh,webhook_callback,placeRequest,AproveRequest,get_all_user_requests} = require('../controllers/order')
const authorization = require('../middleWares/auth')
//get order
OrdersRouter.post('/purhes',[bodyparser.json(),authorization], pursh)
OrdersRouter.post('/placeRequest',[bodyparser.json(),authorization], placeRequest)
OrdersRouter.post('/AproveRequest',[bodyparser.json(),authorization], AproveRequest)
OrdersRouter.get('/get_user_orders',[bodyparser.json(),authorization], get_all_user_requests)
OrdersRouter.post('/webhook',bodyparser.raw({type: 'application/json'}),webhook_callback)


module.exports = {OrdersRouter}
    