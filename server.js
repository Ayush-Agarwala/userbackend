const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
const Usermodel=require("./models/usermodel")

const port = 3000

app.use(express.json())


function authenticateusermiddlware(req,res,next){
  let token=req?.headers?.authorization
  //console.log(token)
  if(!token){
    return res.status(401).json({message:"No token received"})
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = verified;
    next();
    } 
    catch (err) { res.status(400).json({ message: 'Invalid token' });
    }
  }


app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.route('/api/users/:userid').get(authenticateusermiddlware,async(req, res) => {
  try {
    const userid=req.params.userid
    const user=await Usermodel.findById(userid);
    if(!user){
      return res.status(404).json({message:`Cannot find user of id: ${userid}`})
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}).put(authenticateusermiddlware,async(req, res) => {
  try {
    const userid=req.params.userid
    const user=await Usermodel.findByIdAndUpdate(userid,req.body);
    if(!user){
      return res.status(404).json({message:`Cannot find user of id: "${userid}`})
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}).delete(authenticateusermiddlware,async(req, res) => {
  try {
    const userid=req.params.userid
    const user=await Usermodel.findByIdAndDelete(userid,req.body);
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

//READ

app.get('/api/users', authenticateusermiddlware ,async(req, res) => {
  try {
    const users=await Usermodel.find({});
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})


//SIGN_UP

app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  const user = new Usermodel({
  username,
  email,
  password
  });
  user.save()
  .then(user => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY , { expiresIn: '1h' });
  res.json({ token, user });
  })
  .catch(err => res.status(400).json(err));
});


//LOG_IN

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Usermodel.findOne({ email });
    if (!user) {
    return res.status(400).json({ message: 'User not found' });
    }
    if (password != user.password) {
    return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETKEY , { expiresIn: '1h' });
    res.json({ token, user });
});


mongoose.connect(process.env.DB_STRING)
.then(()=>{
  console.log("Connected to Database")
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
}).catch((error)=>{
  console.log("Error Connecting to Database",error)
})