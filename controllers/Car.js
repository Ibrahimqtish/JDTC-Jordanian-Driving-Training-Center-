const  { Cars,TrainingCenter } = require("../modules/products")

//Add Car Controller
const addCar = async (req,res) =>{
    console.log("Adding Car Object to database")
    console.table(req.body)
    if (req.body && req.body.name && req.body.model && req.body.gear_type && req.body.trainingCentersId){
        console.log("Finding Center with ID " ,req.body.trainingCentersId)
        const centers = await TrainingCenter.find({_id:req.body.trainingCentersId})
        console.log(centers)
        if(centers.length){
           console.log("Adding new car ...")
           const car_info =  await new Cars(req.body).save()
           console.log("New Car Has been added")
           return res.json(car_info)
       }else res.status(400).json({"message":"No car id provided"})
    }//return error
    else return res.status(400).json({"message":"Data is wrong!"})
}
const getCar = (req,res) =>{
    if (req.params.carID)Cars.findOne({_id:req.params.carID})
    else res.status(400).json({"message":"No car id provided"})
}


//Get all products and send it to the user
const getAllTrainingCars = async (req , res)=>{
    try {
      //init query params
      const queryParam = {}
      //quiry parames
      const {skip,limit,sort,name} = req.query;

      if (name) queryParam.title = {$regex :`^${name}`}
  
      console.log(JSON.stringify(queryParam))
  
      let resulte =  Cars.find(queryParam)
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
  

const upload_product_pictures = async(req , res)=>{
    try{
      console.log(req.files)
      console.log(req.headers['carid'])
      const CarID = req.headers['carid']
      if(req.files && CarID){
        const urls = []
        //find product by ID
        TrainingCenter.find({_id:CarID}).then(async Car=>{
          //create new promise to resolve the moved Imges
          new Promise((resol ,rej) =>{
            //loop all over the files
            Object.keys(req.files).forEach((item,index)=>{
              //Create url and move the file to it
              const url = `../../Cars/${CarID}/CarImages/${req.files[item].name}`
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
                console.log("Updating database")
                TrainingCenter.updateOne({_id:CarID},{$set:{photos:movedFiles}}).then(resulte=>{res.status(200).json({message:"product photo has been updated"})})}
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
const deleteCare = async (req,res)=>{
    try{
        const carId=req.params.id
        if (carId){
          await Cars.deleteOne({_id:carId})
          const carsData=await Cars.find()
          res.json(carsData)
        }
    }catch(err){
      console.log(err.message)
      res.json({"message":err.message})
    }
}
const getCarById = async (req,res)=>{
  try{
     const CarId = req.params.id
     if (CarId){
        const car = await Cars.findOne({_id:CarId})
        res.json(car)
     }else{
        res.status.json({"message":"please provide car id"})
     }
  }catch(err){
      console.log({"message":err.message}) 
      res.status(402).json({"message":err.message})
  }
}
const EditCar = async (req,res)=>{
    try{
      const RequestBody = req.body
      const id = req.params.id
      const new_car = await Cars.updateOne({_id:id},{$set:RequestBody})
      if (new_car){res.json(new_car)}
    }catch(err){
      console.log({"message":err.message}) 
      res.status(402).json({"message":err.message}) 
    }
}

module.exports = {addCar,getCar,upload_product_pictures,getAllTrainingCars,deleteCare,getCarById,EditCar}
