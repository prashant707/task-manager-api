const express=require('express')

require('./db/mongoose')
// const User=require('./models/user')
// const Task=require('./models/task')
const userRouter=require('./router/user')

const taskRouter=require('./router/task')

const app=express()


const port=process.env.PORT;
const multer=require('multer')
// app.use((req,res,next)=>{
//     // console.log(req.method,req.path)
//     // next()
//     if(req.method==='GET'){
//         res.send('GET request are disabled')

//     }else{
//         console.log(req.method,req.path)
//         next()
//     }
// })

// const upload=multer({
//     dest:'images'
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// })



// app.use((req,res,next)=>{
//     if(req.method==='GET'||'POST'||'PATCH'||'DELETE'){
//         res.status(503).send('site is in maintainenece  mode')

//     }else{
//         next()
//     }
// })

app.use(express.json())

app.use(userRouter)

app.use(taskRouter)
//parse incoming json to object

//  const router=new express.Router()

//  app.use(router)

//  router.get("/tests",(req,res)=>{

//     res.send("testing for router")
//  })



app.listen(port,()=>{
    console.log("serevr stared at "+port)
});


// const jwt=require('jsonwebtoken')

// const myFunction=async () =>{

//    const token= jwt.sign({_id:'abc123'},'thisismynewtoken',{expiresIn:'10 second'});
// console.log(token)

// const data=jwt.verify(token,"thisismynewtoken")

// console.log(data)

// }

//myFunction()

// const Task=require('./models/task')
// const User=require('./models/user')

// const main=async ()=>{

//     const user=await User.findById('5e91cf4c7a8e3125fce70821')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()

