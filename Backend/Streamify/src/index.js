import dotenv from "dotenv";
import connectdb from "./Db/index.js";
import app from "./app.js";

dotenv.config({
    path : './.env'
});

connectdb()
.then( ()=>{
  app.on( "error" , (err)=>{
    console.log(err);
  })
  app.listen( process.env.PORT , ()=>{
   console.log(`App is listening on port : ${process.env.PORT}`);
  })
})
.catch((err)=>{
console.log(`Mongodb connection failed , ${err} `)
})








/*
(async()=>{
  try{
    await mongoose.connect(`${process.env.MONGODB_URL}`)
    app.on("error" , (err)=>{
     console.log("error is " , err);
    })
    app.listen( process.env.PORT , ()=>{
     console.log(`App is listening on PORT ${process.env.PORT}`)
    })
  }
  catch(err){
    console.log(" error is " , err);
  }
})()
*/

