export const register=(req,res)=>{
    const {email,name,password,phone,education,role}=req.body;
    console.log(email);
    console.log(name);
    console.log(password);
    console.log(phone);
    console.log(education);
    console.log(role);

    res.status(200).json({message:"Data recieved successfully!"});
};