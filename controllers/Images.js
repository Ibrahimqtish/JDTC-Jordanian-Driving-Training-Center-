const Images =(req,res)=>{
      console.log("/home/wajdi/Desktop/E-commerce-Last-Version/server"+req.originalUrl)
      res.sendFile("/home/wajdi/Desktop/E-commerce-Last-Version/server"+req.originalUrl)
}
module.exports={Images}