const {user , product , comment} = require ('../modules/products') 

const addCommment =async (req , res)=>{
  try{
      //get comment data form http header
      const commentBody = req.body
      //put user id to comment json
      const userId = req.userId
      const productId = req.params.productId
      //check user id
      if(userId){
        //assign the user id to comment json body
        let newComment = undefined
        const res = user.findOne({_id:userId})
        if (res){ 
           commentBody.username  = res.username
           commentBody.userimage = res.profile_pic
           commentBody.createdby = userId
           commentBody.productId = productId
           console.log(commentBody)
           newComment = new comment(commentBody);
        }
        console.log('res : ' , res)
        await newComment.save().then((resulte) =>{
          return res.status(200).json(resulte)}).catch((err)=>{
          //return error resulte to the client
          console.log(err.message) 
          return res.status(400).send(err.message)
         })  
      }
      else {
         //unauthorized user
         res.sendStatus(401)
      }
}
  //catch the error
  catch(err){
      //send the error resonse
      req.send(err.message)
      console.log(err.message)
  }
}
const deleteCommment = async (req , res)=>{
  try{
      //retrive userid for verification 
      const userid = req.userid
      //retrive commentId informations
      const commentId = req.params.commentId
      //check if commentId existes
      if(userid){
         //delete comment that comes with commnetId
         await comment.deleteOne({_id:commentId,createdby:userid})
         //send the status response to the user
         return res.send({status:'sucssess'})
      }else{  //send error back 
         return res.sendStatus(401)
      }
  }
  catch(err)
  {
     //send error message to the user
     return res.status(401).json(err.message)
  }

}

const editCommment = async (req , res)=>{
try{
   //check if the user authrized for editing the comment
   const userid = req.userid;
   //get comment data
   const commentdata = req.body;
   //check userid
   const commentId = req.params.commentId;
   //check userid
   if(userid){
      //wait until the data updated 
      await comment.updateOne({createdby:userid ,_id:commentId},{$set:commentdata})
      .then((resulte)=>{  
         //send response back to the client if update is succsess
         return es.send({status:resulte.message})
      })
      .catch((err)=>{   
         return res.status(401).json(err.message)
      })
   }
   else{
      return res.sendStatus(401)
   }
}
catch(err){
  console.log(err.message)
  res.sendStatus(400)
}

}
const getComments = async (req , res)=>{
   try{  
      //retrive product id from the URI (/:productId)
      const {productId} = req.params
      console.log(productId)
      //retrive queres
      const {skip , limit} = req.query
      //find the comments in the data base
      const comments = comment.find({productId:productId})
      let resulte = comments
      //check query parameters
      if(skip){
         //skip number of comments
         resulte = resulte.skip(skip)
      }
      if(limit){  
         //start from skipped number of comments 
         //then end on limit number of limit
         resulte = resulte.limit(limit)
      }
      //wait until the resulte came
      await resulte.then((resu)=>{
         //return the resulte to the user
        return res.send(resu)
      })
      //log the errors to the client side
      .catch((err)=>res.json({status:err.message}))
      
   }catch(err){      
          res.sendStatus(401)
   }
}
//exports modules
module.exports = {editCommment,deleteCommment,addCommment,getComments}