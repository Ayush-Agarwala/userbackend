const express = require('express');
const mongoose = require('mongoose');
const app = express()
require('dotenv').config()
const Usermodel=require("./models/usermodel")

const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.route('/api/users/:userid').get(async(req, res) => {
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
}).put(async(req, res) => {
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
}).delete(async(req, res) => {
  try {
    const userid=req.params.userid
    const user=await Usermodel.findByIdAndDelete(userid,req.body);
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

//READ

app.get('/api/users', async(req, res) => {
  try {
    const users=await Usermodel.find({});
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})

// app.get('/api/users/:userid', async(req, res) => {
//   try {
//     const userid=req.params.userid
//     const user=await Usermodel.findById(userid);
//     if(!user){
//       res.status(404).json({message:`Cannot find user of id: "${userid}`})
//     }
//     res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// })

//CREATE

app.post('/api/users', async(req, res) => {
  try {
    const user=await Usermodel.create(req.body)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }

})

//UPDATE
// app.put('/api/users/:userid', async(req, res) => {
//   try {
//     const userid=req.params.userid
//     const user=await Usermodel.findByIdAndUpdate(userid,req.body);
//     if(!user){
//       res.status(404).json({message:`Cannot find user of id: "${userid}`})
//     }
//     res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// })

// //DELETE

// app.delete('/api/users/:userid', async(req, res) => {
//   try {
//     const userid=req.params.userid
//     const user=await Usermodel.findByIdAndDelete(userid,req.body);
//     res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({message:error.message})
//   }
// })

mongoose.connect(process.env.DB_STRING)
.then(()=>{
  console.log("Connected to Database")
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
}).catch((error)=>{
  console.log("Error Connecting to Database",error)
})