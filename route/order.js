const bodyparser = require('body-parser')

const OrdersRouter = require('express').Router()
const {pursh,webhook_callback} = require('../controllers/order')
const authorization = require('../middleWares/auth')
//get order
OrdersRouter.post('/purhes',[bodyparser.json(),authorization], pursh)
OrdersRouter.post('/webhook',bodyparser.raw({type: 'application/json'}),webhook_callback)

module.exports = {OrdersRouter}
