import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true

    },
    password:{
        type:String,
        required:[true,"passowrd is required"],
        lowercase:true,
        trim:true

    },
     fullname:{
        type:String,
        required:true,
        trim:true,
        index:true

    },
    avatar:{
        type:String,
        required:true
    },
      coverImage:{
        type:String,
       
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    refreshToken:{
        type:String
    } 
},{
    timestamps:true
})
userSchema.method.generateAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.method.generateRefreshAccessToken= function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
     this.password= bcrypt.hash(this.password,10)
     next()
})
userSchema.method.isPasswordCorrect= async function(passowrd){
    return await bcrypt.compare(passowrd,this.passowrd); 
}
export const User=mongoose.model("User",userSchema)