const { response } = require('express');
const { default: mongoose } = require('mongoose');
const {user,TrainingCenter,Course, order} =  require('../modules/products');
const { PraperImage } = require('../Utils/utils');

const getCourse = async (req ,res)=>{
     //get product id from http header
    const courseId = req.params.courseId;
    //find product in mangoDB database and then send response
    //send err if product is not exsists         

    await Course.find({_id:courseId}).then(async (response)=>{
        //send response back to the server
        if(response[0]){
          //send response back
          let CourseValue = response[0].toObject()
          
          const CenterValue = await TrainingCenter.find({_id:response[0].TrainingCenterId})
          let CenterObjectValue = CenterValue[0].toObject()
          console.table(CenterObjectValue)
          
          PraperImage(CourseValue.photos,req.headers.host)
          if (CenterValue.length){
            PraperImage(CenterObjectValue.photos,req.headers.host)
            CourseValue.Center= CenterObjectValue
            console.log(CenterObjectValue)
          }
          
          //check orders
          const Orders = await order.find({courseID:CourseValue._id})
          console.log(Orders)
          if (Orders.length)
          CourseValue.status = "reserved"
          return res.json(CourseValue)
        }
        else {
          //send 403 back if response is not defiend
          return res.status(403).json({status:"no resulte"})
        }  
    }).catch((err)=>{
      //send err back
      console.log(err)
      return res.status(403).send(err.message)
    })
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
    //category params
    if(location){
      let countries = location.split(',')
      queryParam.location = {$in:countries}
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
    //filter the name
    if (name) queryParam.title = {$regex :`^${name}`}

    console.log(JSON.stringify(queryParam))

    let resulte =  Course.find(queryParam)
    //SKIP AND SET LIMIT FOR THE NUMBER OF THE
    if(skip) resulte = resulte.skip(skip)
    //limit the number of returend elements
    if(limit)resulte = resulte.limit(limit)
    //sort resulte if sort not null
    if(sort)  resulte = resulte.sort(sort)
    //check name
    resulte = await resulte
    
    for (let i = 0; i < resulte.length;i++){
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
            const url = `images/courses/${courseId}/courseImages/${req.files[item].name}`
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
          console.log(movedFiles)
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

//add product to the database
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
//exports the functions
module.exports={getCourse , 
                getAllProducts,addCourse, 
                editeProduct,deleteProduct,
                upload_coures_pictures,
                getUserProducts}