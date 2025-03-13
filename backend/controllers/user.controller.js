import { User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import Purchase from "../models/purchase.model.js";
import  Course from "../models/course.model.js";

export const signup =async(req,res) =>{

const {firstName,lastName, email,password} = req.body;
const userSchema = z.object({
  firstName: z.string().min(3,{message:"first name must be atleast 3 charlong"}),
  lastName: z.string().min(3,{message:"last name must be atleast 3 charlong"}),
  email: z.string().email(),
  password: z.string().min(6,{message:"password must be atleast 6 charlong"}),
})

const validationResult = userSchema.safeParse(req.body);
if(!validationResult.success){
  return res.status(400).json({errors:validationResult.error.issues.map(err =>err.message)});
}

const hashedPassword = await bcrypt.hash(password,10);


try {
  const existingUser = await User.findOne({email:email})
if(existingUser)
{
  return res.status(400).json({errors : "user already exist"})
}

const newUser = new User({firstName,lastName,email,password:hashedPassword});

await newUser.save();
res.status(201).json({message : "Signup sucessed",newUser})

} catch (error) {
  res.status(500).json({errors : "error in signup"})
  console.log("error in signup",error)
}
};


export const login = async(req,res) =>{

const {email,password} = req.body;
try {
  
const user = await User.findOne({email:email});
const isPasswordCorrect= await bcrypt.compare(password,user.password);

if(!user || !isPasswordCorrect){
  return res.status(403).json({errors : "invalid credentials"})
}
//jwt code

const token = jwt.sign(
  {
  id:user._id,
 
 

},
 config.JWT_USER_PASSWORD,
 {expiresIn:"1d"}

);
const cookieOptions ={
  expires :new Date(Date.now() + 24*60 *60 *1000), // 1 day
  httpOnly:true, //cookie cannot be accessed by javascript
  secure : process.env.NODE_ENV ==="production", //true for https only
  sameSite:"Strict" //prevents csrf attack
}
res.cookie("jwt",token,cookieOptions)

res.status(201).json({message : "login successed",user,token})

} catch (error) {
  res.status(500).json({errors : "error in login"})
  console.log("error in login",error)
}

}


export const logout = async(req,res) =>{
  try{
  
    res.clearCookie("jwt");
     return res.status(200).json({message : "logout successed"})
  
  }
  catch(error){
     return res.status(500).json({errors : "error in logout"})
    console.log("error in logout",error)
  }
  }


export const purchases = async(req,res) =>{


  const userId = req.userId;

  try {

    const purchased =await Purchase.find({userId})

    let purchasedCourseId = []

    for (let i=0; i<purchased.length; i++){
      purchasedCourseId.push(purchased[i].courseId)
     
    }
    const courseData = await Course.find({
      _id :{$in : purchasedCourseId}
    });
    res.status(200).json({purchased,courseData})
    
  } catch (error) {
    res.status(500).json({errors : "error in getting purchasses"})
    console.log("error in purchase",error)
  }
}