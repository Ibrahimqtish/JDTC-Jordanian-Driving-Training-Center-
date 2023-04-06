// import .env
require('dotenv').config()
//import mongoos library to deal with mongodb
const mongoose =  require('mongoose')

//this is a function for connect to the database
const  conntect = async () =>  {
   //connect to the database
   await mongoose.connect(
   //first param
   //data base user name and password
   process.env.MANGO_URI, 
   //second param
   {useNewUrlParser: true,useUnifiedTopology: true,})
 console.log('connected sucssesflly to the database')
}
//
module.exports = {conntect}