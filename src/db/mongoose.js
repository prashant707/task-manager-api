const mongoose=require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
useNewUrlParser:true,
useCreateIndex:true,
useFindAndModify:false,
useUnifiedTopology:true
})



// const Task=mongoose.model('Task',{
//     description:{
//         type:String,
//         trim:true,
//         required:true
//     },
//     completed:{
//         type:Boolean,
//         default:false,

//     }

//     })

// const tasks=new Task({completed:true})

// tasks.save().then(()=>{
//     console.log(tasks)
// }).catch((error)=>{
//     console.log("error! ",error)
// })

// const User=mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
        
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     age:{
//         type:Number,
//         default:0,
//         validate(value){
//             if(value<0){
//                 throw new Error('Age cannot be negative')
//             }

//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('password cannot be password')
//             }
//             else if(value.length<=6){
//                 throw new Error("length should be grater than 6 character")
//             }
//         }

//     }
// })


// const me=new User({
//     name:'   Mahi',
//     email:'   MyEmail@gmail.com   ',
//     password:'   Passcode'
// })

// me.save().then(()=>{
//     console.log(me)
//                 }).catch((error)=>{
//                 console.log("Error! ",error)
//                          });


