const mongoose=require("mongoose")

const userschema=mongoose.Schema(
    {
        username:{
            type: String,
            required: [true,"Username Mandatory"]
        },
        password:{
            type: String,
            required: [true,"Password Mandatory"]
        },
        email:{
            type:String,
            unique: [true, "email already exists in database!"],
            required: [true,"Email mandatory"]
        }
    },
    {
        timestamps: true
    }
)

const User=mongoose.model("User",userschema);

module.exports = User;
