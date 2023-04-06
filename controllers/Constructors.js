const  {Traniners,user} = require("../modules/products")
//Get all products and send it to the user
const getAllTrainingConstructors = async (req , res)=>{
    try {
      //init query params
      const queryParam = {}
      //quiry parames
      const {skip,limit,sort,name,center_id} = req.query;

      if (name) queryParam.title = {$regex :`^${name}`}
      
      queryParam.trainingCentersId =  {$eq:center_id}
      console.log(JSON.stringify(queryParam))
      
      let resulte =  Traniners.find(queryParam)
      //SKIP AND SET LIMIT FOR THE NUMBER OF THE
      if(skip) resulte = resulte.skip(skip)
      //limit the number of returend elements
      if(limit)resulte = resulte.limit(limit)
      //sort resulte if sort not null
      if(sort)  resulte = resulte.sort(sort)

      //check name
      resulte = await resulte
      if(resulte){
        // //send response back
        //  await Traniners.aggregate([{$lookup:{
        //      from:'user',
        //      localField:"userId",
        //      foreignField:"_id",
        //      as:"Users",
        //     }}])
        //     .then(hsh=>{
        //      console.log(hsh)
        //  })
        // console.log("response returend" ,resulte)
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

module.exports={getAllTrainingConstructors}