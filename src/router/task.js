const express=require('express')
const User = require('../models/user')
const router=express.Router();
const auth=require('../middleware/auth')
const Task=require('../models/task')

router.post("/tasks",auth,async (req,res)=>{
    //const task=new Task(req.body)

    const task=new Task({...req.body,owner:req.user._id})
    try{
        await task.save()
            res.status(201).send(task)
        }
        catch(e){
            res.status(400).send(e)
        }
        
//     task.save().then(()=>{
// res.status(201).send(task)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=10 *limit result to 10 per page and skip 10 result do will move to 2nd
//GET /tasks?sortBy=createdAt_asc or createdAt_desc

router.get('/tasks',auth,async (req,res)=>{
    try{
       const match= {};
       const sort={};
       if(req.query.completed){
           match.completed=req.query.completed==='true'
       }

       if(req.query.sortBy){
           const parts=req.query.sortBy.split(":")
            sort[parts[0]]=parts[1]==="desc"?-1:1;
       
        }
   //const tasks=await Task.find({owner:req.user._id})
        
  //const user=await User.findById({_id:req.user._id})
    //await req.user.populate('tasks').execPopulate()
    
    //one way of applying matc
    // await req.user.populate({
    //     path:'tasks',
    //     match:{
    //         completed:match
    //     }
    // }).execPopulate()

    //second way of applying match

    //option is used for pagination 
    //to use limit and skip
    await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()


//    if(!tasks){
//             res.status(404).send()
//         }
        res.send(req.user.tasks)
  // res.send(tasks)

    }catch(e){
        res.status(500).send("error "+e)
    }
    // Task.find({}).then((tasks)=>{res.send(tasks)}).catch((e)=>{
    //     res.send("error"+e)
    // })
})

router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    
    try{
       // const task = await Task.findById(_id)

       const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
                    return res.status(404).send()
                }
                res.status(200).send(task)
    }catch(e){
        res.status(500).send("error "+e)

    }
    
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.status(200).send(task)
    // }).catch((e)=>{
    //     res.status(500).send("error "+e)
    // })
})

router.patch('/tasks/:id',auth,async (req,res)=>{
const _id=req.params.id;
const updates=Object.keys(req.body)
const allowedUpdates=['description','completed']
const isValidOperation=updates.every((update)=>{
    return allowedUpdates.includes(update)

})
if(!isValidOperation){

    res.status(400).send({error:"invalid updates"})
}
try{
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
    //const task=await Task.findById(req.params.id)
    
//const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});

if(!task){
    return res.status(404).send()
}
updates.forEach((update)=>task[update]=req.body[update])
    await task.save()
res.send(task)

}catch(e){
    res.status(400).send(e)
}


})

router.delete('/tasks/:id',auth,async (req,res)=>{

    try{
//const task=await Task.findByIdAndDelete(req.params.id)
const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
if(!task){
    return res.status(404).send()
}
res.send(task)
    }
    catch(e){
res.status(500).send()
    }
})




module.exports=router