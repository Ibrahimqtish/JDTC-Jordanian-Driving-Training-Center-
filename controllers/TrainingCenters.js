const { response } = require('express');
const {TrainingCenter, Feedback} =  require('../modules/products');
const { PraperImage, PraperSingleImage } = require('../Utils/utils');
const { Mongoose } = require('mongoose');
const { default: mongoose } = require('mongoose');

//get all products and send it to the user
const getAllTrainingCenters = async (req , res)=>{
  try {
    //init query params
    const queryParam = {}
    //quiry parames
    const {skip,limit,sort,name,rateFillter,location} = req.query;
    //category params
    if(location){
      let countries = location.split(',')
      queryParam.location = {$in:countries}
    }
    if(rateFillter && rateFillter != -1)
    queryParam.$or = [{rate:{$gt:Number(rateFillter)}},{rate:{$eq:Number(rateFillter)}}] 
    //filter the name
    if (name) queryParam.title = {$regex :`^${name}`}

    console.log(JSON.stringify(queryParam))

    let resulte =  TrainingCenter.find(queryParam)
    //SKIP AND SET LIMIT FOR THE NUMBER OF THE
    if(skip) resulte = resulte.skip(skip)
    //limit the number of returend elements
    if(limit)resulte = resulte.limit(limit)
    //sort resulte if sort not null
    if(sort)  resulte = resulte.sort(sort)
    //check name
    resulte = await resulte
    
    for (let i = 0 ; i < resulte.length;i++){
            console.log(resulte[i].photos)
            PraperImage(resulte[i].photos,req.headers.host) 
    }
    if(resulte){
      //send response back
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


const addTrainingCenter = async (req ,res)=>{
      const Data = req.body
      console.log(req.body)
      //check basic params
      if (!(Data.name && Data.description))return res.status(400).json({"Message":"Lack Of Params"})
      //save and return response
      const CreatedData= await new TrainingCenter(Data).save()
      //return response
      return res.json(CreatedData)
}

const upload_product_pictures = async(req , res)=>{
    try{
      console.log(req.files)
      console.log(req.headers['centerid'])
      const CenterID = req.headers['centerid']
      if(req.files && CenterID){
        const urls = []
        //find product by ID
        TrainingCenter.find({_id:CenterID}).then(async triningCenter=>{
          //create new promise to resolve the moved Imges
          new Promise((resol ,rej) =>{
            //loop all over the files
            Object.keys(req.files).forEach((item,index)=>{
              //Create url and move the file to it
              const url = `images/TraningCenters/${CenterID}/TraningCenterImages/${index+req.files[item].name}`
              req.files[item].mv(url).then(newurl =>{
                urls.push(url)
                if(urls.length == Object.keys(req.files).length){
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
                TrainingCenter.updateOne({_id:CenterID},{$set:{photos:movedFiles}}).then(resulte=>{res.status(200).json({message:"product photo has been updated"})})}
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
async function getTraningCenterById(req,res){
  try{
      const Centerid = req.params.id
      console.log("getTraningCenterById " ,Centerid)
      const result = await TrainingCenter.findOne({_id:Centerid})
      if (result)
      PraperImage(result.photos,req.headers.host)
      res.json(result)
  }catch(err){
    console.log(err)
  }
}
const editTrainingCenter = async (req ,res)=>{
  try{
    const Data = req.body
    const id = req.params.id
    console.log(req.body)
    //check basic params
    if (!(Data.name && Data.description))return res.status(400).json({"Message":"Lack Of Params"})
    //save and return response
    const CreatedData=await TrainingCenter.updateOne({_id:id},{$set:Data})
    //return response
    return res.json(CreatedData)
  }catch(err){
    res.json({"message":err.message})
  }
} 
const deleteCenter = async (req ,res)=>{
  try{
    const id = req.params.id
    //check basic params
    if (id){
      console.log("deleting data")
        //save and return response
        const data =  await TrainingCenter.findOne({_id:id})
        const deleteData=await TrainingCenter.deleteOne({_id:id})
        //return response
        let resulte = await TrainingCenter.find()
        return res.json(resulte)
    }
  }catch(err){
    res.json({"message":err.message})
  }
}
const getMusicList = async (req ,res)=>{
    try{
        console.log("New Requiest")
        const List = [
          {"name":"Tamier hosne","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://arab-zik.com/stream/44070/8DVuj6iXOUgcpiOunMH6FFqf1RRBwAgZs4vEngpb"},
          {"name":"yasen jamal","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://cdn.pixabay.com/audio/2023/04/08/audio_5fd3e66ac3.mp3"},
          {"name":"ahamad jamal","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://cdn.pixabay.com/audio/2022/08/20/audio_53e3aedf91.mp3"},
          {"name":"khali ahmad","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://cdn.pixabay.com/audio/2022/08/20/audio_53e3aedf91.mp3"},
          {"name":"Tamier hosne","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://cdn.pixabay.com/audio/2022/08/20/audio_53e3aedf91.mp3"},
          {"name":"Tamier hosne","image":"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg","sound":"https://cdn.pixabay.com/audio/2022/08/20/audio_53e3aedf91.mp3"}
        ]
        res.json(List)
    }catch(err){
        res.json({"message":err.message})
    }
}

const SubmitReview = async (req,res)=>{
      const {rate , value , center_id} = req.body
      if (rate && value && center_id){
        const NewFeedback = await new Feedback({CenterId:center_id,feedback:value,rate:rate,userId:req.userId}).save()
        const Feedbacks = await Feedback.find({CenterId:center_id})
        let reviewsSum =  0
        for (let i = 0; i < Feedbacks.length;i++){reviewsSum+=Feedbacks[i].rate}
        const newRateValue = reviewsSum/Feedbacks.length
        await TrainingCenter.updateOne({'_id':center_id},{$set:{rate:newRateValue,reviews_count:Feedbacks.length}})
        return res.json(NewFeedback)
      }else{
        return res.status(405).json({"Message":"required fields"})  
      }
}
const getAllCenterReviews = async (req,res) =>{
  try{
      const center_id=req.params.center_id 
      const Feedbacks = await Feedback.find({CenterId:center_id}).populate('userId')
      for (let i of Feedbacks){
        i.userId.profile_pic=PraperSingleImage(i.userId.profile_pic,req.headers.host)
      }
      return res.json(Feedbacks)
  }catch(err){
    return res.json({"message":err.message})
  }
}
module.exports={addTrainingCenter,upload_product_pictures,getAllTrainingCenters,getTraningCenterById,editTrainingCenter,deleteCenter,getMusicList,SubmitReview,getAllCenterReviews}