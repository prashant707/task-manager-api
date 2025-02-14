const express=require('express')
const User=require('../models/user')
const sharp=require('sharp')
const router= express.Router();
const auth=require('../middleware/auth')
const multer=require('multer')
const {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')

router.post('/users/login',async (req,res)=>{
    try{
    const user=await User.findByCredential(req.body.email,req.body.password)
    const token =await user.generateAuthToken()

    res.send({user,token})
    }catch(e){
    res.status(400).send(e)
    }
    
    
    })
    



router.post("/users",async (req,res)=>{
    const user=new User(req.body)
    //res.send('testing')
    try{
    await user.save()
    sendWelcomeEmail(user.email,user.name)
    const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //      res.status(201).send(user)  

    // }).catch((e)=>{
    //     res.status(400)//restatus(400).send(e)
    //     res.send(e)

    // })

})

router.post('/users/logout',auth,async (req,res)=>{
try{
req.user.tokens=req.user.tokens.filter((token)=>{
    return token.token!=req.token
})
await req.user.save()

res.send()

}
catch(e){

res.status(500).send()
}
})

router.post('/users/logoutAll',auth,async (req,res)=>{
try{
    req.user.tokens=[]
    await req.user.save()
    res.send()

}   catch(e){
res.status(500).send()
} 
})

router.get('/users/me',auth,async (req,res)=>{
    
    res.send(req.user)
    // try{
    //     const users=await User.find({})
    //     res.send(users)
    
    // }catch(e){
    // res.status(500).send()
    // }
    
        //     User.find({}).then((users)=>{
    // res.send(users)
    //     }).catch((e)=>{
    //         res.status(500).send("Error "+e)
    //     })
    })
    


    // router.get('/users/:id',async (req,res)=>{
    //     const _id=req.params.id
        
    //     try{
    //         const user=await User.findById(_id)
    //         if(!user){
    //                     return res.status(404).send()
    //                 }
    //             res.status(200).send(user)
    //     }catch(e){
    //         res.status(500).send()
    //     }
        
    //     // User.findById(_id).then((user)=>{
    //     //     if(!user){
    //     //         return res.status(404).send()
    //     //     }
    //     // res.status(200).send(user)
    //     // }).catch((e)=>{
    //     // res.status(500).send()
    //     // })
        
    //     })

        
router.patch('/users/me',auth,async (req,res)=>{
    // const _id=req.params.id;
    // const updates=Object.keys(req.body)

    //const _id=req.user._id

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
   
    const isValidOperation=updates.every((update)=>{
return allowedUpdates.includes(update)
    })
if(!isValidOperation){
    return res.status(400).send({error:'invalid updates'})
}
    
    try{

        //const user= await User.findById(req.user._id)

        updates.forEach((update)=>req.user[update]=req.body[update])

        await req.user.save()
    //    const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        

        
        // if(!user){
        //     return res.status(404).send()

            
        // }
        res.send(req.user)

    }catch(e){

        res.status(400).send(e)
    }


})


router.delete('/users/me',auth,async (req,res)=>{

    try{
// const user=await User.findByIdAndDelete(req.params.id)
// if(!user){
//     return res.status(404).send()
// }
req.user.remove()  //remove is methgod form mongoose 
sendCancellationEmail(req.user.email,req.user.name)
res.send(req.user) // req.user comes form auth middleware
    }
    catch(e){
res.status(500).send()
    }
})

const upload=multer({
   // dest:'avatars', //to save image data to local filesystem
    // limits:{
    //     fileSize:1000000
    // },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('please upload a jpg,jpeg or png file'))
        }
        // cb(new Error('file mustbe a PDF'))
        // cb(undefined,true)
        // cb(undefined,false)

        cb(undefined,true)

        
    }
})

const errorMiddleware=(req,res,nex)=>{
    throw new Error('from my middleware')
}

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    //req.user.avatar=req.file.buffer
    //req.file.buffer  //can only be accessed if dest is not setup in multer handler
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer;
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})



router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})        

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        if(!user || !user.avatar){

        }
        res.set('Content-Type','image/png');
        res.send(user.avatar);



    }catch(e){
        res.status(400).send()
    }
})

module.exports=router