const { user,userGroup, order, Course } = require("../modules/products");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("591903598674-746pln3so790djugv2no0n6024gnfg6h.apps.googleusercontent.com");
const public_keys = require("../google-puclic-keys");
const fs = require("fs");
const {PraperSingleImage } = require("../Utils/utils");
const { PraperImage } = require("../Utils/utils");


const  editUserInformation = async (req, res) => {
    try {
      //Get User ID
      const userId = req.userId;
      const newUserInfo = req.body;
      console.log("this is user info");
      console.log(newUserInfo);
      await user.updateOne({ _id: userId }, { $set: newUserInfo }).then((resulte) => {
          return res.send(resulte);
        }).catch((err) => {
          return res.sendStatus(401);
        });
    } catch (err) {
      res.sendStatus(err.message);
    }
  }
  
  const upload_profile_picture = (req, res) => {
    console.log(req.files);
    if (req.files["profile_pic"] && req.userId) {
      let profile_picture = req.files.profile_pic;
      let url = `/users/${req.userId}/profile_picture/${profile_picture.name}`;
      //updata user informations
      profile_picture.mv(`..${url}`);
      user.updateOne({ _id: req.userId }, { $set: { profile_pic: url } }).then((USER) => {
          //move profile picture to specified pathe
          res.status(200).json({ message: "profile updated succsessfuly" });
        })
        .catch((err) => {
          fs.unlink("..url");
          return res.status(401).send({ message: "unauthorized user" });
        });
    }
  }


const add_user_profile_pictures = async(req , res)=>{
    try{
      console.log(req.headers['user_id'])
      const user_id = req.headers['user_id']
      if(req.files && user_id){
        const urls = []
        //find product by ID
        user.find({_id:user_id}).then(async triningCenter=>{
          //create new promise to resolve the moved Imges
          new Promise((resol ,rej) =>{
            //loop all over the files
            Object.keys(req.files).forEach((item,index)=>{
              //Create url and move the file to it
              const url = `images/Users/${user_id}/UserProfileImage/${req.files[item].name}`
              req.files[item].mv(url).then(newurl =>{
                urls.push(url)
                if(index === Object.keys(req.files).length -1){
                  resol(urls)                       
                }
              }).catch(err=>{
                console.log("err 1 " + err.message)
                return res.status(400).json({message:"error uploading imgs"})
              })
            })
          }).then((movedFiles =>{
            if(movedFiles.length !== 0){
                console.log("updating database")
                user.updateOne({_id:user_id},{$set:{profile_pic:movedFiles[0]}}).then(resulte=>{res.status(200).json({message:"product photo has been updated"})})}
          }))
        }).catch(err=>{
          console.log("err 2 " + err.message)
          return res.status(400).json({message:"no product with this Id"})
        })
        //loop all over the elements
      }else{
        return res.status(400).json({message:"data provided not correct"})
      }
    }catch(err){
      res.json({message:err.message})
    }
  
}
const edit_user_profile_pictures = async(req , res)=>{
  try{
    console.log("edit user image " ,req.userId)
    console.log("req.files " ,req.files)
    const user_id = req.userId
    if(req.files && user_id){
      const urls = []
      //find product by ID
      user.find({_id:user_id}).then(async triningCenter=>{
        //create new promise to resolve the moved Imges
        new Promise((resol ,rej) =>{
          //loop all over the files
          Object.keys(req.files).forEach((item,index)=>{
            //Create url and move the file to it
            const url = `images/Users/${user_id}/UserProfileImage/${req.files[item].name}`
            req.files[item].mv(url).then(newurl =>{
              urls.push(url)
              if(index === Object.keys(req.files).length -1){
                resol(urls)                       
              }
            }).catch(err=>{
              console.log("err 1 " + err.message)
              return res.status(400).json({message:"error uploading imgs"})
            })
          })
        }).then((movedFiles =>{
          if(movedFiles.length !== 0){
              console.log("updating database")
              user.updateOne({_id:user_id},{$set:{profile_pic:movedFiles[0]}}).then(resulte=>{res.status(200).json({message:"product photo has been updated"})})}
        }))
      }).catch(err=>{
        console.log("err 2 " + err.message)
        return res.status(400).json({message:"no product with this Id"})
      })
      //loop all over the elements
    }else{
      return res.status(400).json({message:"data provided not correct"})
    }
  }catch(err){
    res.json({message:err.message})
  }

}

const edit_user_documents = async(req , res)=>{
  try{
      const userId = req.userId
      if (req.files && userId){
          const urls= {}
          for (let [key,value] of Object.entries(req.files)){
            const name = value.mimetype.split('/')[1] 
            const url = `images/Users/${userId}/userdocs/${key}/${key +"."+name}`
            await value.mv(url)
            urls[key] = url
            console.log(urls)
          }
          await user.updateOne({_id:userId},{$set:urls}).then(resulte=>{return res.status(200).json(resulte)}).catch(err=>{
            console.log(err)
          })
      }else{
        console.log(err)        
        return res.status(405).json({"message":"user id and files are required"})
      }
  }catch(err){
       console.log(err)
       return res.status(405).json({"message":err.message})
  }
}


  async function addUser(req,res) {
    try {
      const userInformations = req.body;
      console.log(userInformations);
      const regularExpresionForEmail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (
          userInformations["username"] &&
          userInformations["password"] &&
          userInformations["email"]
        ) {
        console.log(userInformations.email.toLowerCase())
        const u = await user.find({
          email: userInformations.email.toLowerCase(),
        });
        //check user informations
        if (u[0])
          return res.status(404).send({ message: "user already exists"});
        //check email format validation
        if (!userInformations.email.match(regularExpresionForEmail))
          return res.status(422).json({ err: "Invaled email format" });
        if (!userInformations.password.match(strongRegex))
          return res.status(422).json({ err: "Invaled password format" });
        //create new user
        userInformations["email"] = userInformations["email"].toLowerCase();
        const newUserObject = await new user(userInformations)
          //save user and catch errors
          .save().then((resulte) => {
            const sign = jwt.sign({ userId: resulte._id },process.env.ACCESS_TOKEN_SECRET);
            console.log(sign)
            res.json({session_key:sign});
          });
      } else {
        return res.sendStatus(400);
      }
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  }

  async function addNewUser(req,res) {
    try {
      const userInformations = req.body;
      console.log(userInformations);
      const regularExpresionForEmail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      if (
          userInformations["username"] &&
          userInformations["password"] &&
          userInformations["email"]
        ) {
        console.log(userInformations.email.toLowerCase())
        const u = await user.find({
          email: userInformations.email.toLowerCase(),
        });
        //check user informations
        if (u[0])
          return res.status(404).send({ message: "user already exists"});
        //check email format validation
        if (!userInformations.email.match(regularExpresionForEmail))
          return res.status(422).json({ err: "Invaled email format" });
        if (!userInformations.password.match(strongRegex))
          return res.status(422).json({ err: "Invaled password format" });
        //create new user
        userInformations["email"] = userInformations["email"].toLowerCase();
        await new user(userInformations)
          //save user and catch errors
          .save().then((resulte) => {
            res.json(resulte);
          });
      } else {
        return res.sendStatus(400);
      }
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  }
const setUserGroup =(response,code) =>{
  switch (code){
    case 'TRAINER':
      response.isTranier=true;break;
    case 'ADMIN':
      response.isAdmin=true;break;
    case 'USER':
      response.isUser=true;break;
    default:
      response.isUser=true;break;
  }

}

async function getUserSessions(userId){
  const UpComingSessions = await order.find({'userId':userId,'state':'active'})
  if (UpComingSessions.length){
    let upcomming_session = UpComingSessions[0] 
    for (let i = 0;i < UpComingSessions.length;i++){
        if (UpComingSessions[i].requested_date < upcomming_session.requested_date){
            if (UpComingSessions[i].start_time < upcomming_session.requested_date){
              upcomming_session=UpComingSessions[i]
            }
        }
    }
    return upcomming_session
  }
}
async function getuserprofile(req, res) {
    const userId = req.userId;
    if (userId) {
      const upcomingsessions=await getUserSessions(userId)
      const userData = user.findOne({ _id: userId }).then(async (ressponse) => {
        const ProfileData = ressponse.toObject()
        if (ProfileData.group_id){
          const group = await userGroup.findOne({_id:ProfileData.group_id})
          const code =  group.code ? group.code : ''
          setUserGroup(ProfileData,code)
        }
        // ProfileData.isUser=true
        if (upcomingsessions){ProfileData.upcomingsessions=upcomingsessions}
        ProfileData.profile_pic = ProfileData.profile_pic ? PraperSingleImage(ProfileData.profile_pic,req.headers.host) : ""
        ProfileData.driving_license_front = ProfileData.driving_license_front ? PraperSingleImage(ProfileData.driving_license_front,req.headers.host) : ""
        ProfileData.driving_license_back = ProfileData.driving_license_back ? PraperSingleImage(ProfileData.driving_license_back,req.headers.host) : ""
        ProfileData.citizenship_id_front = ProfileData.citizenship_id_front ? PraperSingleImage(ProfileData.citizenship_id_front,req.headers.host) : ""
        ProfileData.citizenship_id_back = ProfileData.citizenship_id_back ? PraperSingleImage(ProfileData.citizenship_id_back,req.headers.host) : ""
        return res.json(ProfileData);
      });
    } else {
      return res.status(401).send({ message: "unauthorized user" });
    }
  }
  //authorization with google
  async function g_auth0(req, res) {
    const authToken = req.headers["g-auth-token-id"];
    if (authToken) {
      //verify token
      const ticket = await client.verifyIdToken({
        idToken: authToken,
        audience:"591903598674-746pln3so790djugv2no0n6024gnfg6h.apps.googleusercontent.com",
      });
      //get paylaod from token
      const payload = ticket.getPayload();
      //get user infromations from database to verify it
      const userInformations = await user.find({ email: payload.email });
      //CHECK IF USER INFORMATIONS IS EXISTES IN DATABASE
      if (userInformations[0]) {
        console.log("user found here : " + userInformations[0]);
        const sign = jwt.sign({ userId: userInformations[0]["_id"] },process.env.ACCESS_TOKEN_SECRET);
        console.log(sign);
        return res.json({ session_key: sign });
      } else {
        const userInformations = {
          profile_pic: payload.picture,
          username: payload.name,
          password: payload.sub,
          email: payload.email,
        };
        user.create(userInformations).then((response) => {
            const sign = jwt.sign({ userId: response._id },process.env.ACCESS_TOKEN_SECRET);
            return res.json({ session_key: sign });
          })
          .catch((err) => {
            console.log(err);
            return res.status(401).json({ message: "invaled token" });
          });
      }
    }
}

const loginWithGoogle = async (req,res)=>{
  console.log(req.headers['auth-key'])
  res.json({"message":req.headers['auth-key']})
}
  //login with email and passoword
const  login = async (req, res) => {
    try {
      let email = req.body.email || undefined;
      const password = req.body.password || undefined;
      console.log(email + " " + password);
      //check user informations
      email = email.toLowerCase();
      if (email && password) {
        //verify user account information from database
        const userData = await user.find({ email: email, password: password });
        console.log(userData);
        if (userData[0]) {
          const sign = jwt.sign({ userId: userData[0]._id },process.env.ACCESS_TOKEN_SECRET);
          console.log("login done!");
          return res.json({ session_key: sign });
        } else {
          return res
            .status(401)
            .json({ message: "You are not registered in this application , account information is wrong" });
        }
      } else {
        console.log("no information provided");
        return res.sendStatus(400);
      }
    } catch (err) {
      console.log(err);
      return res.sendStatus(401);
    }
  };
  

//login with email and passoword
const admin_login = async (req, res) => {
  try {
    let email = req.body.email || undefined;
    const password = req.body.password || undefined;
    console.log(email + " " + password);
    //check user informations
    email = email.toLowerCase();
    if (email && password) {
      //verify user account information from database
      const userData = await user.find({ email: email, password: password });
      if (userData[0]){
        const user_group =  await userGroup.find({_id:userData[0].group_id});
        if(user_group[0].code === 'ADMIN'){
            const sign = jwt.sign({ userId: userData[0]._id },process.env.ACCESS_TOKEN_SECRET);
            console.log("login done!");
            return res.json({ session_key: sign });
        }else{
          return res.status(601).json({"message":"you are not admin user"});
        }
      } else {
        return res
          .status(602)
          .json({ message: "Your don't have an account" });
      }
    } else {
      console.log("no information provided");
      return res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

  const removeUser = async (req, res) => {
    try {
      //get user id from verify the token
      const userId = req.userId;
      console.log("userid deleted " ,userId)
      //check userid is not undefined
      if (userId) {
        //await for deleting user
        await user
          .deleteOne({ _id: userId })
          .then((res) =>  res.sendStatus(200).json({"message" : res}));
        
      } else {
        return res.sendStatus(401);
      }
    } catch (err) {
      return res.sendStatus(400);
    }
  };
const getUserById = async (req,res)=>{
  const id = req.params.id
  console.log("user id " , id)
  const userData = await user.find({_id:id})
  console.log(" userData " ,userData)
  return res.json(userData)
}

//get all products and send it to the user
const getAllUsers = async (req,res)=>{
  try{
    //init query params
    const queryParam = {}
    //Quiry parames
    const {skip,limit,sort,name,rateFillter,center_id} = req.query;
    //category params
    //filter the price
    if(rateFillter && rateFillter != -1)
    queryParam.$or = [{rate:{$gt:Number(rateFillter)}},{rate:{$eq:Number(rateFillter)}}]
    if(center_id)
    queryParam.trainingCentersId =  {$eq:center_id} 
    //filter the name
    if (name) queryParam.title = {$regex :`^${name}`}
    console.log(JSON.stringify(queryParam))
    let resulte =  user.find(queryParam)
    //SKIP AND SET LIMIT FOR THE NUMBER OF THE
    if(skip) resulte = resulte.skip(skip)
    //limit the number of returend elements
    if(limit)resulte = resulte.limit(limit)
    //sort resulte if sort not null
    if(sort)  resulte = resulte.sort(sort)
    //check name
    resulte = await resulte
    
    if(resulte){
      //send response back
      for (let i = 0; i < resulte.length;i++){
        resulte[i].profile_pic =  PraperSingleImage(resulte[i].profile_pic,req.headers.host)
      }
      res.status(200).json(resulte)  
    }
    else {
      res.sendStatus(404);
    }
  }catch (err){
    console.log(err)
    res.sendStatus(400)
  }
}

const getUserGroups = async (req,res)=>{
  try{
        const UserGroups = await userGroup.find()
        res.json(UserGroups) 
  }catch (err){
    console.log(err)
    res.sendStatus(400)
  }
}
const editUserInfo = async (req,res)=>{
      try{
          const id =  req.params.id
          const data=req.body
          const newData = await user.updateOne({_id:id},{$set:data})
          res.json(newData)
      }catch(err){
          console.log(err.message)
          res.json({"message":err.message})
      }
}
const editUserProfile = async (req,res)=>{
  try{
      const id = req.userId
      console.log("editing user account with id " , id)
      const data=req.body
      const newData = await user.updateOne({_id:id},{$set:data})
      res.json(newData)
  }catch(err){
      console.log(err.message)
      res.json({"message":err.message})
  }
}
const deleteuser = async (req,res)=>{
  try{
      const userId = req.params.id
      console.log("userId " , userId)
      await user.deleteOne({_id:userId})
      const newData = await user.find()
      res.json(newData)
  }catch(err){
    res.json({"message":err.message})
  }
}

const TrainingRequest = async (req,res) =>{    
    const course_ids = []
    const UserCourses= await Course.find({constructorId:req.userId})
    for (let i = 0;i < UserCourses.length;i++){course_ids.push(UserCourses[i]._id)}
    const OrdersPending = await order.find({courseID:{$in:course_ids}})
    for (let i = 0; i < OrdersPending.length;i++){
      console.log('Get course data ' , OrdersPending[i].order_data[0])
      if (OrdersPending[i].order_data.length && OrdersPending[i].order_data[0].photos){
        OrdersPending[i].order_data[0].photos =  PraperImage(OrdersPending[i].order_data[0].photos,req.headers.host)
      }
    }
    return res.json(OrdersPending)
}

const getAdminProfile = async (req,res) =>{
  const userId = req.userId;
  if (userId) {
    const userData = user.find({ _id: userId }).then(async (ressponse) => {
      ressponse[0].profile_pic = ressponse[0].profile_pic ? PraperSingleImage(ressponse[0].profile_pic,req.headers.host) : ""
      ressponse[0].driving_license_front = ressponse[0].driving_license_front ? PraperSingleImage(ressponse[0].driving_license_front,req.headers.host) : ""
      ressponse[0].driving_license_back = ressponse[0].driving_license_back ? PraperSingleImage(ressponse[0].driving_license_back,req.headers.host) : ""
      ressponse[0].citizenship_id_front = ressponse[0].citizenship_id_front ? PraperSingleImage(ressponse[0].citizenship_id_front,req.headers.host) : ""
      ressponse[0].citizenship_id_back = ressponse[0].citizenship_id_back ? PraperSingleImage(ressponse[0].citizenship_id_back,req.headers.host) : ""
      return res.json(ressponse[0]);
    });
    console.log('With admin info ',userData)
  } else {
    return res.status(401).send({ message: "unauthorized user" });
  }
}

module.exports={addNewUser,TrainingRequest,
                add_user_profile_pictures,
                getUserGroups,removeUser,
                login, g_auth0,deleteuser,
                getuserprofile,addUser,
                upload_profile_picture,
                editUserInformation,getAllUsers,
                admin_login,editUserInfo,
                getUserById,editUserProfile,
                edit_user_profile_pictures,
                edit_user_documents,loginWithGoogle,
                getAdminProfile
              };
