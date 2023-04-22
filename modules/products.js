const mongoose = require('mongoose');
const { PraperImage, formatiFloatTime } = require('../Utils/utils');
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
      carsID          :   {type:mongoose.Schema.ObjectId,required:true},
      numberOfSessions:   {type:String,require:true}
})
const TrainingCentersSchema = new Schema({
    name:         {type:String,required:true},
    photos:       {type:Array, required:false},
    description:  {type:String, required:true},
    open_time:    {type:Number,required:true},
    close_time:   {type:Number,required:true},
    contact_number:{type:String,required:false},
    website       :{type:String,required:false},
    longitude:    {type:String, required:false},
    latitude:     {type:String,required:false},
    location:     {type:String,required:false},
    rate :        {type:Number, required:false,default:0},
    active:       {type:Boolean,required:false,default:true}
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
        driving_license_front:{type:String,required:false},
        driving_license_back:{type:String,required:false},
        citizenship_id_front:{type:String,required:false},
        citizenship_id_back:{type:String,required:false},
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

const QuastionsBankSchema = new Schema({
    name        : {type: String , required:true},
    qustions    : {type: Array  , required:false},
    courseID    : {type: String , required:true},
    level       : {type: String , required:false},                
});
const QuastionSchema = new Schema({
    quastion :{type: String , required:true},
    answers  :{type:Array,required:true},
    courseID :{type:String , required:false},
    correct_answer:{type:String ,required:true},
    quastionBankId:{type:String ,required:true}
})
const ExamsSchema = new Schema({
    name :{type: String , required:true},
    level  :{type:String,required:true},
    courseID :{type:String , required:true},
    quastionBankId:{type:String ,required:true},
    quastions:{type: Array  , required:true},
})
const TakenExamsSchema = new Schema({
    examId  :{type:String,require:true},
    userId  :{type:String,require:true},
    courseID:{type:String,require:true},
    mark    :{type:Number,require:true},
    answers:{type:Array,require:false}
})

TrainingCentersSchema.virtual('fullPathImages').get(function(){
    console.log("_____________________Compaine]omain______________________")
    return PraperImage(this.photos,"Ahmad")
})
//TrainingCentersSchema.pre('findOne', function() {
//       console.log("_____________________Component______________________")
//       return this.open_time=formatiFloatTime(this.open_time)
// })
//TrainingCentersSchema.pre('find', function() {
//     console.log("_____________________Component______________________")
//     return this.open_time=0
// })
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

const QuastionBank = mongoose.model('QuastionsBank',QuastionsBankSchema);

const Quastion = mongoose.model('Quastion',QuastionSchema);

const Exams = mongoose.model('Exams',ExamsSchema);

const TakenExams = mongoose.model('TakenExams',TakenExamsSchema);




/////////////////////////////Middelwares///////////////////////////////////
TrainersSchema.pre('deleteOne',function (doc,next){
    console.log("______________________delete______________________")
    next()
})





//exports the models
module.exports = {Course,user,Cars,order,TrainingCenter,Feedback,userGroup,Traniners,QuastionBank,Quastion,Exams,TakenExams}
