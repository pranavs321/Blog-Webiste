import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/user_route.js";

const app = express();
app.use(express.json());
dotenv.config();  

const port = process.env.PORT;
const MONGO_URL=process.env.MONGO_URI;


//middleware
app.use(express.json());
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
