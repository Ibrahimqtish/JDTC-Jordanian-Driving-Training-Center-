const { Applications } =  require("../modules/products");

class App{
        //add product to the database
        AddApplication = async (req , res)=>{
            try{
                //get user information from the DATA_BASE (get product creater Id)
                const AppInformations = req.body
                const userId = req.userId
                //check for products informations
                if(AppInformations.name){
                //assign user id to the product OwnerId prop
                AppInformations.OwnerId = userId
                AppInformations.SecureKey=require('crypto').randomBytes(48).toString('hex')
                const NewApplication = new Applications(AppInformations)           
                //add the product to the database 
                NewApplication.save().then((resulte)=>{
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
                res.status(401).json({message:err.message})
            }
        }
        getApplications = async (req , res)=>{
            const useId = req.userId;
            if (useId){
            const apps = await Applications.find({OwnerId:useId})
            if (apps)res.json(apps)
            else res.status(400)
            }
        }

}
module.exports = {App}