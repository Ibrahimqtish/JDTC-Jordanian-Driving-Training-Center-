const express = require('express')
const router =  express.Router()
const {authorization,AdminAuthorization}  = require('../middleWares/auth')

const {addNewUser,edit_user_documents,
       add_user_profile_pictures,
       removeUser,getUserGroups,
       login, g_auth0,getuserprofile,TrainingRequest,
       addUser,upload_profile_picture,deleteuser,
       editUserInformation,editUserProfile,loginWithGoogle,getAdminProfile,
       getAllUsers,admin_login, editUserInfo, getUserById, edit_user_profile_pictures}= require('../controllers/users')
       
       router.post('/login-with-google',loginWithGoogle)
       router.post('/login',login)
       router.post('/admin_login',admin_login)
       router.post('/signup',addUser)
       router.post('/addNewUser',addNewUser)
       router.put('/editNewUser/:id',editUserInfo)
       router.put('/editeuserinformation',authorization,editUserInformation)
       router.delete('/deleteaccount',authorization,removeUser)
       router.post('/g_auth0' , g_auth0)
       router.get('/profile' ,authorization, getuserprofile)
       router.post('/upload-profile-picture' ,authorization, upload_profile_picture)
       router.get('/get_all_users', getAllUsers)
       router.get('/getUserById/:id', getUserById)
       router.get('/get_groups' ,getUserGroups)
       router.put('/editUserProfile',authorization,editUserProfile)
       router.put('/editUserProfileImage',authorization,edit_user_profile_pictures)
       router.post('/add_user_profile_pictures',add_user_profile_pictures)
       router.post('/upload-user-docs' ,authorization, edit_user_documents)
       router.delete('/delete/:id' ,authorization, deleteuser)
       router.get('/TrainingRequest' ,authorization, TrainingRequest)
       router.get('/getAdminProfile',AdminAuthorization,getAdminProfile)
       
module.exports = router