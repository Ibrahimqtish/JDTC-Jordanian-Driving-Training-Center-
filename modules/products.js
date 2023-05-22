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
      reviews_count   :   {type:Number, required:false,default  : 0},
      constructorId   :   {type:mongoose.Schema.ObjectId,required:true,ref:'user'},
      active          :   {type:Boolean,required:false,default:true},
      TrainingCenterId:   {type:mongoose.Schema.ObjectId,ref:'TrainingCenters',required:true},
      Level           :   {type:String,require:true},
      start_time      :   {type:Number,required:false},
      end_time        :   {type:Number,required:false},
      duration        :   {Type:Number,required:false},
      start_date      :   {type:Date,required:false},
      carsID          :   {type:mongoose.Schema.ObjectId,ref:"Cars",required:true},
      numberOfSessions:   {type:String,require:true}
})
const TrainingCentersSchema = new Schema({
      name:          {type:String,required:true},
      photos:        {type:Array, required:false},
      description:   {type:String, required:true},
      open_time:     {type:Number,required:true},
      close_time:    {type:Number,required:true},
      contact_number:{type:String,required:false},
      website       :{type:String,required:false},
      longitude:     {type:String, required:false},
      latitude:      {type:String,required:false},
      location:      {type:String,required:false},
      rate :         {type:Number, required:false,default:0},
      reviews_count :{type:Number, required:false,default:0},
      active:        {type:Boolean,required:false,default:true}
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
      isUser :          {type:Boolean,required:false},
      isTranier :       {type:Boolean,required:false},
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
})

const FeedbackSchema = new Schema({
       CenterId  :{type:mongoose.Schema.ObjectId,required:true,ref:'TrainingCenters'},
       feedback   :{type:String ,  required:true},
       userId    :{type:mongoose.Schema.ObjectId,required:true,ref:'user'},
       rate      :{type:Number , required:true}
});
const CourseFeedbackSchema = new Schema({
      CourseId  :{type:mongoose.Schema.ObjectId,required:true,ref:'TrainingCenters'},
      feedback  :{type:String ,  required:true},
      userId    :{type:mongoose.Schema.ObjectId,required:true,ref:'user'},
      rate      :{type:Number , required:true}
});
const orderSchema = new Schema({
       userId:{type:mongoose.Schema.ObjectId,ref:"user",require:true},
       start_time:{type:Number,require:true},
       end_time:{type:Number,require:true},
       requested_date:{type:Date,require:true},
       courseID:{type:mongoose.Schema.ObjectId,ref:"Courses",require:true},
       sessionId:{type:mongoose.Schema.ObjectId,ref:"AvilableSessions",require:true},
       order_data               : {type: Object , required:false},
       stipe_checkout_session_id: {type: String , required:false},
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
       ExamLength:{type: Number  , required:false},
       ExamLengthType:{type: String  , required:false},
       question_mark:{type: Number  , required:true},
})
const TakenExamsSchema = new Schema({
       examId  :{type:String,require:true},
       userId  :{type:String,require:true},
       courseID:{type:String,require:true},
       mark    :{type:Number,require:true},
       answers :{type:Array,require:false},
       full_mark:{type:Number,require:true},
})

const Course = mongoose.model('Courses',CoursesSchema);
//user model
const user = mongoose.model('user',usersSchema);
//category model
const Feedback = mongoose.model('Feedback',FeedbackSchema);
//course feedback
const CourseFeedback = mongoose.model('CourseFeedback',CourseFeedbackSchema);
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


TrainingCenter.watch().on('change' , async (data)=>{
    if (data.operationType == 'delete'){
            console.log("------------------------deleting related records to Center-------------------------------")
            console.log(data.documentKey._id)
            await Course.deleteMany({TrainingCenterId:data.documentKey._id})
        }
})
Course.watch().on('change' , async (data)=>{
        if (data.operationType == 'delete'){
            console.log("------------------------deleting related records to course-------------------------------")
            await Exams.deleteMany({courseID:data.documentKey._id})
            await QuastionBank.deleteMany({courseID:data.documentKey._id})
        }
})
QuastionBank.watch().on('change' , async (data)=>{
        if (data.operationType == 'delete'){
            console.log("------------------------deleting related records to questions bank-------------------------------")
            await Quastion.deleteMany({courseID:data.documentKey._id})
        }
})
//exports the models
module.exports = {Course,user,Cars,order,TrainingCenter,Feedback,userGroup,Traniners,QuastionBank,Quastion,Exams,TakenExams,CourseFeedback}
