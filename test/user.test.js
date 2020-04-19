const request=require('supertest')
const app=require('../src/app')
const jwt=require('jsonwebtoken')
const User=require('../src/models/user')
const mongoose=require('mongoose')

const userOneId=new mongoose.Types.ObjectId()

const userOne={
    _id:userOneId,
    name:'Mike',
    email:'prashantsj643@gmail.com',
    password:'abc@12345',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

beforeEach(async ()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

// afterEach(()=>{
//     console.log("after Each")
// })

test('Should signup a new user',async ()=>{
    const response=await request(app).post('/users').send({
        name:"Prashant",
        email:'gehlotprashantk@gmail.com',
        password:'abcd@12345'
    }).expect(201)

    //Assert that the database was change correctly
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user:{
            name:'Prashant',
            email:'gehlotprashantk@gmail.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('abc@12345')
})

test('shoud login existing user',async ()=>{
    const response=await request(app).post('/users/login').send({
     email:userOne.email,
     password:userOne.password   
    }).expect(200)

    const user=await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('shoud not login existing user',async ()=>{
    await request(app).post('/users/login').send({
     email:userOne.email,
     password:"ancd13445"  
    }).expect(400)
})

test('should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete profile for user', async ()=>{
await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
const user=await User.findById(userOneId)   
expect(user).toBeNull()
    
})

// test('should delete profile for user', async ()=>{
//     await request(app)
//     .delete('/users/me')
//     .send()
//     .expect(401)
// })


