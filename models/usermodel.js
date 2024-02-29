const mongoose=require("mongoose")

const userschema=mongoose.Schema(
    {
        username:{
            type: String,
            required: [true,"Username Mandatory"]
        },
        gender:{
            type: String,
            required: [true,"Gneder Mandatory"]
        },
        age:{
            type: Number,
            required: [true,"Age Mandatory"]
        },
        position:{
            type: String,
            required: [true,"Position Mandatory"]
        }
    },
    {
        timestamps: true
    }
)

const User=mongoose.model("User",userschema);

module.exports = User;
