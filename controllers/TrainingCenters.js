const { response } = require('express');
const {TrainingCenter} =  require('../modules/products');
const { PraperImage } = require('../Utils/utils');

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
            console.log("fullPathImages " , resulte[i].fullPathImages)
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
              const url = `images/TraningCenters/${CenterID}/TraningCenterImages/${req.files[item].name}`
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
      const id = req.params.id
      console.log("id " ,id)
      const result = await TrainingCenter.findOne({_id:id})
      PraperImage(result.photos,req.headers.host)
      console.debug("getTraningCenterById " + id )
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
module.exports={addTrainingCenter,upload_product_pictures,getAllTrainingCenters,getTraningCenterById,editTrainingCenter}