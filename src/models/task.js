const mongoose=require('mongoose')
const validator=require('validator')


const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId ,//data stored in owner is gonna be object id
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

taskSchema.pre('save',async function(next){
    const task=this;
console.log("middelware updated for task")

   next()

})

const Task=mongoose.model('Task',taskSchema)

    module.exports=Task
