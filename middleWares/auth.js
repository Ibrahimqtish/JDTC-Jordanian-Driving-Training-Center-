const jwt = require('jsonwebtoken')
const {user, userGroup} = require('../modules/products') 
//////////////////////////////////////////////////////

const authorization = async (req , res , next)=>{
  //get authorization header
  const AuthHeadr = req.headers['authorization']
  let token = undefined
  //check if authorization header is exestest
  if(AuthHeadr){
    //split header key from "bear"
    token = req.headers['authorization'].split(' ')[1]
    console.log(token)
    if(token){
        //verify the token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,resulte)=>{
        if (resulte){
            //find product in database
            user.find({_id:resulte.userId}).then((u) =>{
            console.log(u)
            req.userId  = u[0]['_id']
            req.isAdmin = u[0].isAdmin || false;
            next()
            //catch err in the database
            }).catch(err =>{
            console.log('err occures')
            console.log(err)
            return res.status(401).send({message:'you are not authorized'})
            })
        //check if there is an error   
        }else if(err){
         //return err to the user
         return res.status(401).send({message:'you are not authorized'})
        }
        //username authrization 
        })    
    }
  }else {
    return res.sendStatus(401)
  }
}
const AdminAuthorization = async (req , res , next)=>{
  //get authorization header
  const AuthHeadr = req.headers['authorization']
  let token = undefined
  //check if authorization header is exestest
  if(AuthHeadr){
    //split header key from "bear"
    token = req.headers['authorization'].split(' ')[1]
    let isDone = false
    if(token){
        //verify the token
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async(err,resulte)=>{
            if (err)return res.status(401).send({message:'you are not authorized'})
            if (!resulte)return res.status(401).send({message:'you are not authorized'})
            const User = await user.findOne({_id:resulte.userId})
            if (!User || !User.group_id)return res.status(401).send({message:'you are not authorized'})
            const AdminGroup =  await userGroup.findOne({_id:User.group_id})
            if (AdminGroup.code.toLowerCase() != 'admin')return res.status(401).send({message:'you are not authorized'});
            req.userId= User._id
            next()
        })
    }
  }else {
    return res.sendStatus(401)
  }
}
module.exports = {authorization,AdminAuthorization}