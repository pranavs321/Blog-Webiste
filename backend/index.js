import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import userRoute from "./routes/user_route.js";

const app = express();
app.use(express.json());
dotenv.config();  

const port = process.env.PORT;
const MONGO_URL=process.env.MONGO_URI;


//cloudinary
cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME, 
        api_key:process.env.CLOUD_API_KEY, 
        api_secret:process.env.CLOUD_SECRET_KEY,
    });
    
//middleware
app.use(express.json());
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:"/tmp/"
}));


//DATABASE CODE 
try{
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}catch(error){
  console.log(error);
  process.exit(1);
}

//defining routes
app.use("/api/users",userRoute);
app.listen(port, () => {
  console.log(`Server is running port ${port}`)
})

