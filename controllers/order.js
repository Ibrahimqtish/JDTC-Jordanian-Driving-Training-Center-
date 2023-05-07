const stripe = require('stripe')(process.env.STRIPE_SEC_KEY)
const {Course,order} = require('../modules/products')

const check_date= (proposed_course,taken_courses)=>{
      const proposed_course_start_date = Date.parse(proposed_course.start_date)
      const proposed_course_end_date   = Date.parse(proposed_course.start_date)+(proposed_course.number_of_sessions * (24 * 60 * 60 * 1000))        
      //Loop all over courses
      for (let i = 0;i < taken_courses.length;i++){

          console.log("taken_courses[i].courseID.start_time ",taken_courses[i].courseID.start_time)
          console.log("proposed_course.start_time " ,proposed_course.start_time)

          console.log("taken_courses[i].end_time ", taken_courses[i].courseID.end_time)
          console.log("proposed_course.end_time " , proposed_course.end_time)

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

const pursh = async (req,res)=>{
   try{
      const userID = req.userId
      //get orders from requies body
      const RequestBody = req.body
      //fetch products data from data base
      console.log(req.body)
      const courseID = RequestBody.courseID
      //find prducts in data base with IDs
      console.log("courseID " , courseID)
      let db_courses = await Course.find({_id:courseID})
      console.log( JSON.stringify(db_courses))
      if (!db_courses.length){
            res.json({"message":"course not exsists"})
      }
      let PrevOrders= await order.find({'userId':userID,'courseID':courseID})
      //
      let prev_orders=await order.find({'userId':userID}).populate('courseID')
      console.log("prev_orders.courseID " , prev_orders.courseID)

      if (check_date(db_courses[0],prev_orders)){
         return res.status(200).json({"Message":"you have time conflict"})  
      }
      if(PrevOrders.length){
         return res.status(200).json({"Message":"you already paid for this course"})
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
      console.log(stripe_orders)
      order.userID = userID
      if(db_courses && db_courses.length !== 0){
         await stripe.checkout.sessions.create({
            payment_method_types :['card'],
            mode:'payment',
            line_items:stripe_orders,
            metadata:{orders:JSON.stringify({'state':"pending",'userId':userID,'courseID':courseID})},
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
      const NewOrders = await new order({'state':"active",'userId':data.userId,'courseID':data.courseID}).save()
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
      console.log(session)
      data = JSON.parse(session.metadata.orders)
      data.stipe_checkout_session_id = session.payment_intent
      updateProduct(data)
      console.log(data)
   }
   res.status(200).send()
}

module.exports = {pursh , webhook_callback}