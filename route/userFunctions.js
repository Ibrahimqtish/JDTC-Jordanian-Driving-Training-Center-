const express = require('express')
const router =  express.Router()
const authorization  = require('../middleWares/auth')

const { addCommment 
       ,deleteCommment,
        editCommment,
        getComments
      }
      = require('../controllers/userFunctions')

//add comment to product
router.post('/comments/addcomment',authorization,addCommment)
//edit comment
router.put('/comments/editcomment/:commentId',authorization,editCommment)
//delete comment
router.delete('/comments/deletecomment/:commentId',authorization,deleteCommment)
//get comments for selected product
router.get('/comments/getcomments/:productId', getComments)
//exports the routers
module.exports = router