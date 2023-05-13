const stripe = require('stripe')(process.env.STRIPE_SEC_KEY)
const {Course,order} = require('../modules/products')

const check_date= (proposed_course,taken_courses)=>{
      const proposed_course_start_date = Date.parse(proposed_course.start_date)
      const proposed_course_end_date   = Date.parse(proposed_course.start_date)+(proposed_course.number_of_sessions * (24 * 60 * 60 * 1000))        
      //Loop all over courses
      for (let i = 0;i < taken_courses.length;i++){
          const taken_end_date=(taken_courses[i].courseID.numberOfSessions * (24 * 60 * 60 * 1000)) + Date.parse(taken_courses[i].courseID.start_date)
          const taken_start_date=Date.parse(taken_courses[i].courseID.start_date)

          if ((taken_start_date >= proposed_course_start_date && proposed_course_start_date < taken_end_date) ||
              (taken_start_date >= proposed_course_end_date   && proposed_course_end_date   < taken_end_date)) {
               if ((taken_courses[i].courseID.start_time <= proposed_course.start_time && proposed_course.start_time < taken_courses[i].courseID.end_time) || 
               (taken_courses[i].courseID.start_time <= proposed_course.end_time && proposed_course.end_time < taken_courses[i].courseID.end_time)){
                  return true
               }else{
                  return false
               }
          }

      }
}

const CheckTimeConflicts = (taken_sessions,proposed_session)=>{
   
   const proposed_session_date=Date.parse(proposed_session.requested_date)
   const start_time=proposed_session.start_time
   const end_time=proposed_session.end_time

   for (let i = 0;i < taken_sessions.length;i++){
       console.log("taken date ", Date.parse(taken_sessions[i].requested_date))
       console.log('proposed_session_date ' , proposed_session_date)
       console.log("Date conflict with " + i,proposed_session_date==Date.parse(taken_sessions[i].requested_date))
       
       if (proposed_session_date==Date.parse(taken_sessions[i].requested_date)){
         if ((start_time >= taken_sessions[i].start_time && start_time <= taken_sessions[i].end_time) || (end_time >= taken_sessions[i].start_time && end_time <= taken_sessions[i].end_time)){
            return true
         }
       }
   }
}

const pursh = async (req,res)=>{
   try{
      const userID = req.userId
      //get orders from requies body
      const RequestBody = req.body
      //fetch products data from data base
      const courseID = RequestBody.courseID
      console.log('==============================================Purchuse Request===============================================')
      console.log("Requet Body " ,RequestBody)
      console.log("CoursesID " ,RequestBody.courseID)

      const db_courses = await Course.find({_id:RequestBody.courseID})
      console.log("Course From DB ",db_courses)
      if (!db_courses){
            return res.status(400).json({"message":"course not exsists"})
      }
      let prev_orders=await order.find({'userId':userID}).populate('courseID')
      
      if (CheckTimeConflicts(prev_orders,RequestBody)){
         return res.status(400).json({"Message":"you have time conflict"})  
      }
      //Prepare stripe order details object
      let stripe_orders = db_courses.map((item,index) =>{
            return{price_data:{
                                 currency:'usd',
                                 product_data:{
                                    productId:item._id,
                                    name : item.title
                                 },
                                 unit_amount: Number(Math.floor(item.coste * 100))          
                                 },
                     quantity:1}
      })
      //check order
      // console.log(stripe_orders)
      order.userID = userID
      if(db_courses && db_courses.length !== 0){
         await stripe.checkout.sessions.create({
            payment_method_types :['card'],
            mode:'payment',
            line_items:stripe_orders,
            metadata:{orders:JSON.stringify({'state':"pending",
                                             'userId':userID,
                                             'courseID':courseID,
                                             'start_time':RequestBody.start_time,
                                             'end_time':RequestBody.end_time,
                                             'requested_date':RequestBody.requested_date})},
            success_url: 'http://localhost:3000/',
            cancel_url: 'http://localhost:3000/'
         }).then((resulte)=>{
            //return the response to the user
            return res.json(resulte)
         }).catch(err=>console.log(err))
         
      }else{
         return res.status(500).json({message:'you did not provide correct order informations'})
      }
   }catch(err){
      console.log({err})
      return res.status(400).json({message:err.message})
   }
}


const updateProduct  = async (data) =>{
      console.log(data)
      const NewOrders = await new order({'state':"active",'userId':data.userId,'courseID':data.courseID,'start_time':data.start_time,"end_time":data.end_time,'requested_date':data.requested_date}).save()
      return NewOrders  
}
const webhook_callback =  (req , res)=>{
   //get body contents
   let payload = req.body
   const sig = req.headers['stripe-signature'];
   let event;
   try {
     //sign
     event = stripe.webhooks.constructEvent(payload,sig,'whsec_48841faba8675861d5c5e9b800b4d8b39ddb0f60e20fa43797fbacb0b535e668')
   }catch(err){
    console.log(err.message)
    return res.status(404).send()
   }
   if(event.type === 'checkout.session.completed'){
      const session = event.data.object
      // console.log(session)
      data = JSON.parse(session.metadata.orders)
      data.stipe_checkout_session_id = session.payment_intent
      updateProduct(data)
      // console.log(data)
   }
   res.status(200).send()
}

module.exports = {pursh , webhook_callback}