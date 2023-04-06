const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CoursesSchema = new Schema({                           
      title           :   {type:String,required:true},
      photos          :   {type:Array, required:false},
      discrption      :   {type:String, required:true},
      coste           :   {type:Number, required:false,delfult : 1},
      currency        :   {type:String,enum:['jo',"usd"]},
      rate            :   {type:Number, required:false,default  : 0},
      constructorId   :   {type:mongoose.Schema.ObjectId,required:true},
      active          :   {type:Boolean,required:false,default:true},
      TrainingCenterId:   {type:mongoose.Schema.ObjectId,required:true},
      Level           :   {type:String,require:true},
      start_time      :   {type:Number,required:false},
      end_time        :   {type:Number,required:false},
      duration        :   {Type:Number,required:false},
      start_date      :   {type:Date,required:false},
      carsID          :   {type:mongoose.Schema.ObjectId,required:false},
      numberOfSessions:   {type:String,require:true}
})

const TrainingCentersSchema = new Schema({                      
    name:         {type:String,required:true},
    photos:       {type:Array, required:false},
    description:  {type:String, required:true},
    longitude:    {type:String, required:false},
    latitude:     {type :String,required:false},
    location:     {type :String,required:false},
    rate :        {type:Number, required:false,default  : 0},
    active:       {type:Boolean,required:false,default:true},
    details:      {type:String,required:false},
    location: { 
        "street_no": {type:String}, 
        "street1":   {type:String}, 
        "street2":   {type:String}, 
        "city":      {type:String},  
        "zip":       {type:String}, 
        "country":   {type:String}, 
    }
})


const CarsSchema = new Schema({                           
    name:             {type:String,required:true},
    photos:           {type:Array, required:false},
    model:            {type:String, required:false},
    gear_type:        {type:String, required:true,enum:['automatec', 'manual']},
    car_type:         {type:String, required:true,enum:['2-doors-sedan', '4-doors-sedan','bus',"truck"]},
    active:           {type:Boolean,required:false,default:true},
    trainingCentersId:{type:mongoose.Schema.ObjectId,required:true}, 
})

const TrainersSchema = new Schema({                           
    experiance:       {type:Number,required:true},
    userId:           {type:String,required:true},
    rate:             {type:Number,required:true},
    trainingCentersId:{type:String,required:true},
})


const userGroupSchema = new Schema({
      name:{type:String,required:true},
      code:{type:String,required:true},
      access_rights:{type:Array}
})

const usersSchema = new Schema({
        username:         {type:String,required:true},
        profile_pic :     {type:String,required:false},
        password:         {type:String,required:false},
        isAdmin :         {type:Boolean,required:false},
        phone_number:     {type:String,required:false},
        email:            {type:String,required:true},
        group_id:         {type:String,required:false},
        experiance:       {type:Number,required:false},
        rate:             {type:Number,required:false},
        trainingCentersId:{type:String,required:false},
        birthdate        :{type:Date  ,required:false},
        location:{
            "street_no": {type:String}, 
            "street1":   {type:String}, 
            "street2":   {type:String}, 
            "city":      {type:String},    
        }
})

const FeedbackSchema = new Schema({
    productId  :{type : String , required:true},
    commentText:{type:String ,  required:true},
    createdby  :{type: String ,   required:true},
    username   :{type:String , required:true},
    userimage  :{type:String ,required:false}
});

const orderSchema = new Schema({
    order_data               : {type: Array  , required:false},
    stipe_checkout_session_id: {type: String , required:false},
    courseID                 : {type: String , required:true},
    userId                   : {type: String , required:true},
    state                    : {type: String , required:true},                
});


//products model
const Course = mongoose.model('Courses',CoursesSchema);
//user model
const user = mongoose.model('user',usersSchema);
//category model
const Feedback = mongoose.model('Feedback',FeedbackSchema);
//create order in wait
const order = mongoose.model('order',orderSchema);
//categories
const Cars = mongoose.model('Cars',CarsSchema);
//user groups
const userGroup = mongoose.model('UserGroup',userGroupSchema);
//trainers
const Traniners = mongoose.model('Traniners',TrainersSchema);
//Tranining center
const TrainingCenter = mongoose.model('TrainingCenters',TrainingCentersSchema);
//exports the models
module.exports = {Course,user,Cars,order,TrainingCenter,Feedback,userGroup,Traniners}
