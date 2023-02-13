const express=require('express')
const cors = require ('cors')
const mongoose= require('mongoose')
const User = require('./models/User')
const Place = require('./models/Place')
const bcrypt=require ('bcryptjs')
const JWT= require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const imageDownloader = require ('image-downloader')
const multer=require('multer')
const fs = require('fs')
const Booking = require('./models/booking')

require('dotenv').config()

const app=express()

// secret
const bcryptSalt=bcrypt.genSaltSync(10)
const JWYSecret="random"

// Database connection
mongoose.connect(process.env.MONGO_URL)

// allow frontend to access and send data
app.use(cors({
    credentials:true,
    origin:'http://localhost:5174'
}))

// abitlity to read sent json data
app.use(express.json())

// ability to read cookies
app.use(cookieParser())

// for displaying images in the front
app.use('/uploads',express.static(__dirname+"/uploads"))

//get User data from token
function getUserDataFromReq(req)
{
    return new Promise((resolve,reject)=>{
        JWT.verify( req.cookies.token, JWYSecret,{},async (err,userData)=>{
            if(err) throw err
            resolve(userData)
        })
    })
   
}

// APIs

// Register
app.post('/register',async (req,res)=>{
    const {name,email,password} =req.body
   
    try {
        const user = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt)
        })
        res.json({user})
    } catch (error) {
        res.status(422).json(error)
    }
})

// Login
app.post('/login',async (req,res)=>{
    const {email,password} =req.body
   
    const user=await User.findOne({email})
    if(user)
    {
        const passOk=bcrypt.compareSync(password,user.password)
        if (passOk)
        {
            JWT.sign({email:user.email,id:user._id},JWYSecret, {}, (err,token)=>{
                if (err) throw err
                res.cookie('token',token).json(user)
            })
        }
        else
        res.status(422).json('pass not OK')
    }
    else
    res.json('not found')
})

// get user data
app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    if(token)
    {
        JWT.verify(token, JWYSecret,{},async (err,userData)=>{
            if (err)throw err
            const {name,email,_id}= await User.findById(userData.id)
            
            res.json({name,email,_id})
        })
    }
    else
    res.json(null)
})

// logout
app.post('/logout',(req,res)=>{
    res.cookie('token','').json(true)
})

// upload image with link
app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body
    const newName=Date.now()+'.jpg'
    await imageDownloader.image({
        url:link,
        dest:__dirname+'/uploads/'+newName
    })
    res.status(200).json(newName)
})

// upload images from computer
const photosMiddleware=multer({dest:'uploads/'})
app.post('/upload',photosMiddleware.array('photos',100),(req,res)=>{
    const uploadedFiles=[]
    for (let i=0;i<req.files.length;i++)
    {
        const {path,originalname}=req.files[i]
        const parts =originalname.split('.')
        const ext=parts[parts.length -1]
        const newPath=path+'.'+ext
        fs.renameSync(path,newPath)
        uploadedFiles.push(newPath.replace('uploads\\',""))
    }
res.json(uploadedFiles)
})

// add new Place
app.post('/newPlace',(req,res)=>{
    const {token} = req.cookies;
    const {address,title,addedPhotos,description,perks,extraInfo,checkIn,checkOut, maxGuests,price}=req.body
        JWT.verify(token, JWYSecret,{},async (err,userData)=>{
            if (err)throw err
            const placeDoc = await Place.create({
                owner:userData.id,
                title,address,photos:addedPhotos,description,perks,extraInfo,checkIn,checkOut, maxGuests,price
        })
        res.json(placeDoc)
       
    })
}) 

// get Places for user
app.get('/userPlaces',(req,res)=>{
    const {token} = req.cookies;
    JWT.verify(token, JWYSecret,{},async (err,userData)=>{
        const {id}=userData
        res.json(await Place.find({owner:id}))
    })
})

// get place with Id
app.get('/places/:id',async (req,res)=>{
    const {id}=req.params
    res.json(await Place.findById(id))
})

//update place
app.put('/updatePlace',async(req,res)=>{
    const {id,address,title,addedPhotos,description,perks,extraInfo,checkIn,checkOut, maxGuests,price}=req.body
    const {token} = req.cookies;
    JWT.verify(token, JWYSecret,{},async (err,userData)=>{
        const placeDoc=await Place.findById(id)
        if (err) throw err


        if(userData.id===placeDoc.owner.toString())
            placeDoc.set({
                title,address,photos:addedPhotos,description,perks,extraInfo,checkIn,checkOut, maxGuests,price
        })
            await placeDoc.save()
            res.json('ok')
        })
    })

//get all places
app.get('/places',async (req,res)=>{
    res.json(await Place.find())
})

// book a place
app.post('/bookings',async (req,res)=>{
    const userData=await getUserDataFromReq(req)
    const {place,checkIn, checkOut,numberOfGuests,name,phone,price}=req.body
    Booking.create({place,checkIn, checkOut,numberOfGuests,name,phone,price,user:userData.id})
        .then((doc)=>{res.json(doc)})
        .catch((err)=>{throw err})
})

// get user Bookings
app.get('/bookings',async (req,res)=>{
    const userData = await getUserDataFromReq(req)
    res.json( await Booking.find({user:userData.id}).populate('place'))
})

app.listen(4000)









