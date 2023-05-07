const {Quastion, Exams, TakenExams, Course, QuastionBank} = require('../modules/products')
const {inspect} = require('util');
const { param } = require('../route/Car');

const AddQuastionsBank = async (req,res) =>{
    try{
        if (req.body.name){
            const quationsbank =  await new QuastionBank(req.body).save()
            return res.json(quationsbank)         
        }return res.status(422).json({"message":"lack params"})
    }catch(err){
        console.log(err)
        return res.status(402).json({"message":err.message})
    } 
}

const getQuastionsBanks = async (req,res) =>{
    try{
        const quationsbanks = await QuastionBank.find()
        console.log(quationsbanks)
        return res.json(quationsbanks)
    }catch(err){
        console.log(err)
        return res.status(405).json({"message":err.message})
    }
}
const AddQuastions = async (req,res) =>{
    const RequestBody = req.body
    console.log(inspect(RequestBody,{depth:null,colors:true}))
    try{
        if (RequestBody.quastion && RequestBody.answers && RequestBody.correct_answer,RequestBody.quastionBankId){
            const quastions = await  new Quastion(RequestBody).save()
            if (quastions){res.json(quastions)}
        }else{
            res.status(402).json({"message":"lack params"})     
        }
    }catch(err){
       console.log({"message":err.message}) 
       res.status(402).json({"message":err.message}) 
    }
}
const EditQuastions = async (req,res) =>{
    try{
        const RequestBody = req.body
        const id = req.params.id
        console.log(inspect(RequestBody,{depth:null,colors:true}))
        console.log("(RequestBody , id)",RequestBody,id)
        if (RequestBody.quastion && RequestBody.answers && RequestBody.correct_answer,RequestBody.quastionBankId){
            const quastions = await Quastion.updateOne({_id:id},{$set:RequestBody})
            if (quastions){res.json(quastions)}
        }else{
            res.status(402).json({"message":"lack params"})
        }
    }catch(err){
       console.log({"message":err.message}) 
       res.status(402).json({"message":err.message}) 
    }
}
const EditExam = async (req,res) =>{
    try{
        const RequestBody = req.body
        const id = req.params.id
        console.log("(RequestBody , id)",RequestBody,id)
        const quastions = await Exams.updateOne({_id:id},{$set:RequestBody})
        if (quastions){res.json(quastions)}
    }catch(err){
       console.log({"message":err.message}) 
       res.status(402).json({"message":err.message}) 
    }
}
const getQuastions = async (req,res) =>{
    try{
        const quations = await Quastion.find()
        console.log(quations)
        return res.json(quations)
    }catch(err){
        console.log(err)
        return res.status(405).json({"message":err.message})
    }
}
const getQuastionByID = async (req,res) =>{
    try{
        const id = req.params.id
        const quation = await Quastion.find({_id:id})
        console.log(quation)
        return res.json(quation[0])
    }catch(err){
        console.log(err)
        return res.status(405).json({"message":err.message})
    }
}
const addExam = async (req,res)=>{
    try{
        const data = req.body
        console.log("adding " ,data)
        const newExamRecord = await new Exams(data).save()
        console.log(newExamRecord)
        return res.json(newExamRecord) 
    }catch(err){
        console.log(err)
        return res.status(405).json({"message":err.message})
    }
}
const getExams = async (req,res)=>{
    try{
        const ExamRecords = await Exams.find()
        res.json(ExamRecords) 
    }catch(err){
        console.log(err)
        return res.status(405).json({"message":err.message})
    }
}

const check_containes = (list,value)=>{
       for (let i = 0;i < list.length;i++){
            if (value == list[i]){
                return true
            }       
       }
       return false
}

const getExamByCourse = async (req,res)=>{
   try{
        console.log("geting exam by id " , req.params.courseId) 
        const ExamRecords = await Exams.find({'courseID':req.params.courseId})
        console.log("All exams ",ExamRecords)

        let TakenExamsIds=[]
        const TakenExamsList=await TakenExams.find({userId:req.userId,courseID:req.params.courseId})
        TakenExamsIds=TakenExamsList.map(item=>{return item.examId})
        console.log("TakenExamsIds " , TakenExamsIds)
        if (ExamRecords.length){
            //quations = await Quastion.find({_id:{$in:ExamRecords[0].quastions}})
            for (let i = 0;i < ExamRecords.length;i++){
                
                if (!(check_containes(TakenExamsIds,ExamRecords[i]._id.toString()))){
                    const resulte = {"exam_Id":ExamRecords[i]._id}
                    return res.json(resulte)
                }
            }
            return res.status(404).json({"message":"There is no exam for you"})
        }else{
            return res.status(404).json({"message":"There is now exam"})
        } 

   }catch(err){
        console.log(err)
        res.status(440).json({"message":err.message})
   }
}
const getNativeExamById=async (req,res)=>{
   try{
        console.log("GETTING EXAM WITH ID OF : " ,req.params.examId)
        const ExamRecords = await Exams.find({_id:req.params.examId})
        console.log(JSON.stringify(ExamRecords))
        return res.json(ExamRecords[0])
   }catch(err){
        console.log(err)
        res.status(440).json({"message":err.message})
   }
}
const getExamById = async (req,res)=>{
    try{
         console.log("geting exam by id " , req.params.examId) 
         const ExamRecords = await Exams.find({_id:req.params.examId})
         const quations    = await Quastion.find({_id:{$in:ExamRecords[0].quastions}})
         const ExamRecordsObject = ExamRecords[0].toObject()  
         const resulte = {"courseID":ExamRecordsObject.courseID ,"exam_Id": ExamRecordsObject._id , "quations":quations} 
         return res.json(resulte)
    }catch(err){
     console.log(err)
         res.status(440).json({"message":err.message})
    }
}
const SubmitAnswers = async (req,res)=>{
    try{ 
         let totalMark = 0
         const examData = req.body
         const QuasetionsIds = []
         for (let i = 0;i < examData.Answers.length;i++){
             for (const [key,value] of Object.entries(examData.Answers[i])){
                  QuasetionsIds.push(key)
             }
         }
         const quations=await Quastion.find({_id:{$in:QuasetionsIds}})
         for (let i = 0;i < quations.length;i++){
             if (quations[i].correct_answer == examData.Answers[i][quations[i]._id]){
                console.log("You got it right")
                totalMark += 1
             }else{
                console.log("You got it wrong")
                console.log("You got it fuck you")
             }
         }
         const resulte = await new TakenExams({"examId":examData.examId,
                                                'userId':req.userId,
                                                'courseID':examData.courseID,
                                                'answers':examData.Answers,mark:totalMark}).save()
         return res.json(resulte)
    }catch(err){
     console.log(err)
         res.status(440).json({"message":err.message})
    }
}
const getExamResulte = async (req,res)=>{
    try{ 
         console.log("req.params.examId " , req.params.examId)
         console.log("req.params.examId " , req.userId)

         const result = {}
         const TakenExam = await TakenExams.findOne({'examId':req.params.examId,'userId':req.userId})
         const ExamRecords = await Exams.findOne({_id:req.params.examId})
         const CourseRecords = await Course.findOne({_id:ExamRecords.courseID})
         if (TakenExam){
            result['Mark']=TakenExam.mark
         }
         if (ExamRecords){
            result['ExamName'] = ExamRecords.name 
         }
         if (CourseRecords){
            result['Coursename'] = CourseRecords.title 
         }
         return res.json(result)
    }catch(err){
     console.log(err)
         res.status(440).json({"message":err.message})
    }
}
const getBankByID= async (req,res)=>{
        try{
            const bank_id = req.params.id
            if (bank_id){
                const quastion_bank = await QuastionBank.findOne({_id:bank_id})
                console.log("QuastionBank " , quastion_bank)
                res.json(quastion_bank)
            }else{
                res.status(400).json({"message":"lack params"})
            }
        }catch(err){
            console.log(err.message)
            res.json({"message":err.message})
        }
}
const EditQuastionsBank = async (req,res)=>{
    try{
        const RequestBody = req.body
        const id = req.params.id
        console.log(inspect(RequestBody,{depth:null,colors:true}))
        console.log("(RequestBody , id)",RequestBody,id)
        const quastion_bank = await QuastionBank.updateOne({_id:id},{$set:RequestBody})
        if (quastion_bank){res.json(quastion_bank)}
    }catch(err){
       console.log({"message":err.message}) 
       res.status(402).json({"message":err.message}) 
    }
}
module.exports={AddQuastionsBank,getQuastionsBanks,AddQuastions,getQuastions,addExam,getExams,
                getExamByCourse,getExamById,SubmitAnswers,getQuastionByID,
                EditQuastions,getNativeExamById,EditQuastionsBank,
                EditExam,getExamResulte,getBankByID}
