const express = require('express')
const router =  express.Router()
const authorization  = require('../middleWares/auth')

const {addNewUser,
       add_user_profile_pictures,
       removeUser,getUserGroups,
       login, g_auth0,getuserprofile,
       addUser,upload_profile_picture,
       editUserInformation,
       getAllUsers,admin_login}= require('../controllers/users')

router.post('/login',login)
router.post('/admin_login',admin_login)
router.post('/signup',addUser)
router.post('/addNewUser',addNewUser)
router.put('/editeuserinformation',authorization,editUserInformation)
router.delete('/deleteaccount',authorization,removeUser)
router.post('/g_auth0' , g_auth0)
router.get('/profile' ,authorization, getuserprofile)
router.post('/upload-profile-picture' ,authorization, upload_profile_picture)
router.get('/get_all_users', getAllUsers)
router.get('/get_groups' ,getUserGroups)
router.post('/add_user_profile_pictures',add_user_profile_pictures)
module.exports = router