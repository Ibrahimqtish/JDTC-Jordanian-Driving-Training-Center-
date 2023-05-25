const { response } = require('express');
const { default: mongoose } = require('mongoose');
const {Course, order, CourseFeedback, TrainingCenter} =  require('../modules/products');
const { PraperImage, PraperSingleImage } = require('../Utils/utils');




const getCourse = async (req ,res)=>{
  try{
        //get product id from http header
        const courseId = req.params.courseId;
        //find product in mangoDB database and then send response
        let courseValue = {};
        if (req.headers.mapdata == 'true'){
            courseValue =  await Course.findOne({_id:courseId}).populate('TrainingCenterId').populate('constructorId')
            PraperImage(courseValue.TrainingCenterId.photos,req.headers.host)
            PraperSingleImage(courseValue.constructorId.profile_pic,req.headers.host)
        }
        else{
            courseValue =  await Course.findOne({_id:courseId})
        }
        courseValue=courseValue.toObject()
        //Prepare orders
        const Orders = await order.find({courseID:courseValue._id})
        if (Orders.length)courseValue.status = "reserved"
        console.log("courseValue.status ",courseValue)
        //prepare images
        PraperImage(courseValue.photos,req.headers.host)
        return res.json(courseValue)
  }catch(err){
    console.error(err)
    res.status(500).json({"message":err.message})
  }
} 

const getUserProducts = async(req , res)=>{
  const useId = req.userId;
    if (useId){
    const products = await product.find({userId:useId})
    if (products)res.json(products)
    else res.status(400)
    }
}
//get all products and send it to the user
const getAllProducts = async (req , res)=>{
  try {
    //init query params
    const queryParam = {}
    //quiry parames
    const {priceLessThan,pricegreaterthan,skip,limit,sort,name,rateFillter,location} = req.query;
    const {fill} = req.headers
    //category params
    if(location){
      let countries = location.split(',')
      for (let i = 0;i < countries.length;i++)countries[i]=countries[i].trim() 
      const center_ids = []
      const TrainingCenters_ids = await TrainingCenter.find({location:{$in:countries}}).select('id')
      for (let i = 0;i < TrainingCenters_ids.length;i++)center_ids.push(TrainingCenters_ids[i]['_id'])
      queryParam.TrainingCenterId = {$in:center_ids}
    }
    //Filter the price
    if(priceLessThan && pricegreaterthan){
      queryParam.$and = [{$or:[
                            {coste:{$gt:Number(pricegreaterthan)}},
                            {coste:{$eq:Number(pricegreaterthan)}}
                          ]},{$or:[
                            {coste:{$lt:Number(priceLessThan)}},
                            {coste:{$eq:Number(priceLessThan)}}
                          ]}]
    }
    else if(priceLessThan)queryParam.coste = {$lt:Number(priceLessThan)};
    else if(pricegreaterthan)queryParam.coste = {$gt:Number(pricegreaterthan)};
    if(rateFillter && rateFillter != -1)
    queryParam.$or = [{rate:{$gt:Number(rateFillter)}},{rate:{$eq:Number(rateFillter)}}] 
    //Filter the name
    if (name) queryParam.title = {$regex :`^${name}`}
    console.log(JSON.stringify(queryParam))    
    let resulte = Course.find(queryParam)
    // courseValue =  await Course.findOne({_id:courseId})
    //SKIP AND SET LIMIT FOR THE NUMBER OF THE
    if(skip) resulte = resulte.skip(skip)
    //limit the number of returend elements
    if(limit)resulte = resulte.limit(limit)
    //sort resulte if sort not null
    if(sort){
      const Sorting = {}
      Sorting[sort] =sort =='coste'?'asc':'desc'
      resulte = resulte.sort(Sorting)
    }
    //check name
    if (fill){
        resulte = await resulte.populate('TrainingCenterId')
        for (let i of resulte){
          PraperImage(i.TrainingCenterId.photos,req.headers.host)
        }
    }else{
        resulte = await resulte
    }
    for (let i = 0; i < resulte.length;i++){
      PraperImage(resulte[i].photos,req.headers.host)
    }

    if(resulte){
      //send response back
      console.log('resulte ' ,req.query)
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

 

// const upload_coures_pictures = async (req,res) =>{
//       const courseId = req.headers['courseid']
//       if(!req.files || !courseId){return res.status(403).json({"message":"Lack params"})}
//       const course = await Course.find({_id:courseId})

//       if (!course)return res.status(403).json({"message":"course is not  exists"})

//       const files = req.files
//       const imageUrls = []
//       for (const [key,value] of Object.entries(files)){
//         const url = `images/courses/${courseId}/courseImages/${value.name}`
//           const image = await value.mv(url,(err) =>{
//             if (err) return res.json({"message":"something went wrong"})
//             console.log(err)
//             imageUrls.push(url)
//           })
//       }
//       Course.updateOne({_id:courseId} , {$set:{ photos:imageUrls}}).then(resulte=>{res.status(200).json({message:"course photo has been updated"})})
// }

const upload_coures_pictures = async(req , res)=>{
  try{
    console.log("Uploading Image ",req.files)
    const courseId = req.headers['courseid']
    console.log(req.headers['courseid'])
    if(req.files && courseId){
      const urls = []
      //find product by ID
      Course.find({_id:courseId}).then(async productItem=>{
        //create new promise to resolve the moved Imges
        new Promise((resol ,rej) =>{
          //loop all over the files
          Object.keys(req.files).forEach((item,index)=>{
            //create url and move the file to it
            const url = `images/courses/${courseId}/courseImages/${index+req.files[item].name}`
            req.files[item].mv(url,err =>{
                if (err)return res.status(400).json({message:"error uploading imgs"})
                urls.push(url)
                console.log((urls.length == Object.keys(req.files).length))
                if((urls.length == Object.keys(req.files).length)){resol(urls)}
            })
          })
        }).then((movedFiles =>{
          console.log("movedFiles ", movedFiles)
          if(movedFiles.length !== 0){
             Course.updateOne({_id:courseId} , {$set:{photos:movedFiles}}).then(resulte=>{
              res.status(200).json({message:"course photo has been updated"})             
             })
          }
        }))
      }).catch(err=>{
        console.log("err 2 " + err.message)
        return res.status(400).json({message:"no course with this Id"})
      })
      //loop all over the elements
    }else{
      return res.status(400).json({message:"data provided not correct"})
    }
  }catch(err){
    res.json({message:"imgs info is not correct"})
  }
}

//Add product to the database
const addCourse = async (req , res)=>{
      try{
          //get user information from the DATA_BASE (get product creater Id)
          const CourseInformations = req.body
          // const userId = req.userId
          CourseInformations.TrainingCenterId = mongoose.Types.ObjectId(CourseInformations.TrainingCenterId) 
          console.log("Adding Course with following info :",req.body)
          //check for products informations
          if(CourseInformations.title && CourseInformations.discrption){
            //assign user id to the product OwnerId prop
            //productInformations.userId = userId
            const newCourse = new Course(CourseInformations)           
            //add the product to the database 
            newCourse.save().then((resulte)=>{
                res.json(resulte)
            }).catch((err)=>{
                //return error 
                res.sendStatus(err)
            })
          }else{
            res.status(405).json({'message' : 'bad parameters'})
          }
       }
       catch(err){
           res.status(401).json({message:"luck of informations"})
       }
}


const editeProduct = async (req , res)=>{
  
  const newProductData = req.body
  const productId = req.params.productId
  let productData = undefined
    
  productData = await product.find({_id:productId})
  console.log(productData)         
  try{
    if(productData){   
        if(req.userId){
          console.log('user id is  : '  + req.userId)

          if(productData[0]['OwnerId'] === req.userId){
            await product.updateOne({id:productId} , {$set: newProductData})
            console.log('your product is has been edited succssfully!')
            return res.json({status : "sucssess!"})
          }
          else{ 
            //not authorized user
            return res.sendStatus(401)
          }
        }
        else {
          return es.sendStatus(405)
        }
    }
    else{
      return res.sendStatus(401)
    }
  }
  catch(err){
      res.sendStatus(404)
      console.log(err)
  }
}

const deleteProduct = async (req , res)=>{
  try{
    //get product ID
    const productId = req.params.productId
    console.log('Deleted Product Id ' , productId)
    //retrive product informations
    const productInformations = await product.find({_id:productId})
    //check if product id is equales user product id
    console.log('----------------------------------------')
    console.log(productInformations[0].userId)
    console.log(req.userId)
    console.log('----------------------------------------')

    if(productInformations[0].userId == req.userId){
        //save deleted product then send deleted product as json object
        await product.deleteOne({_id:productId}).
        //incase the product deleted successfully tell the adminstrator 
        then((reslute)=>console.log('product with ' + productId + ' has been deleted')).
        catch((err)=>{console.log(err); res.sendStatus(404)})
        //send the resulte back
        console.log('product is deleted')
        res.sendStatus(200)
    }
    else{
      //if the Unauthorized to delete the product send back 401 status code
      res.sendStatus(401)
    }   
  }
  catch (err){
      res.sendStatus(404)
  }
}
const editCourse = async (req,res)=>{
  try{
      const id = req.params.id
      const CourseNewData = req.body
      const newcoursedata = await Course.updateOne({_id:id} , {$set:CourseNewData})
      return res.json(newcoursedata)
  }catch(err){
      console.log(err)
      return res.json({"message":err.message})
  }
}
const getCoursesByCenterId = async (req,res)=>{
    try{
          const id = req.params.id
          const courses = await Course.find({TrainingCenterId:id})
          for (let i = 0; i < courses.length;i++){
              PraperImage(courses[i].photos,req.headers.host)
          }
          res.json(courses)
    }catch(err){
          res.status(405).json({message:err.message})
    }
}
const myCourses = async (req,res)=>{
        try{
            const id = req.userId;
            const TakenCourses = await order.find({userId:id})
            console.log("Taken courses " , JSON.stringify(TakenCourses))
            if (TakenCourses.length){
                const CourseIds = TakenCourses.map(item=>{return item.courseID})
                const Courses = await Course.find({_id:{$in:CourseIds}})
                res.json(Courses)
            }else{
              res.json([])
            }
        }catch(err){
          console.log(err)
            res.status(400).json({"message" :err.message})
        }
      //const Course = Course.find({_id:{$in:Courses}})  
}

const DeleteCourseById = async (req,res)=>{
  try{
      const id = req.params.id
      if (id){
        const deletedCourse=await Course.deleteOne({_id:id})
        const NewData = await Course.find()
        return res.json(NewData)
      }
  }catch(err){
      console.log(ere)
      res.json({"message":err.message})
  }
}

const SubmitReview = async (req,res)=>{
  try{
        const {rate , value , center_id} = req.body
        if (rate && value && center_id){
            const NewFeedback = await new CourseFeedback({CourseId:center_id,feedback:value,rate:rate,userId:req.userId}).save()
            const Feedbacks = await CourseFeedback.find({CourseId:center_id})
            let reviewsSum =  0
            for (let i = 0; i < Feedbacks.length;i++){reviewsSum+=Feedbacks[i].rate}
            const newRateValue = reviewsSum/Feedbacks.length
            const course = await Course.updateOne({'_id':center_id},{$set:{rate:newRateValue,reviews_count:Feedbacks.length}})
            return res.json(NewFeedback)  
        }else{
            return res.status(405).json({"Message":"required fields"})
        }

  }catch(err){
      res.status(500).json({"message":"somthing went wrong"})
  }
}
const getAllCourseReviews = async (req,res) =>{
    try{
      const center_id=req.params.center_id 
      const Feedbacks = await CourseFeedback.find({CourseId:center_id}).populate('userId')
      for (let i of Feedbacks){
        i.userId.profile_pic=PraperSingleImage(i.userId.profile_pic,req.headers.host)
      }
      return res.json(Feedbacks)
    }catch(err){
      return res.json({"message":err.message})
    }
}

//Exports the functions
module.exports={getCourse ,myCourses, 
                getAllProducts,addCourse, 
                editeProduct,deleteProduct,
                upload_coures_pictures,getCoursesByCenterId,
                getUserProducts,editCourse,DeleteCourseById,SubmitReview,getAllCourseReviews}