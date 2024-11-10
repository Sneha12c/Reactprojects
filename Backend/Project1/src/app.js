import express, { urlencoded } from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  Credential : true,
}))

app.use(express.json({limit: "16kb" }));
app.use(express.urlencoded({extended: true})) // to encode the url
app.use(express.static("public")) // any file will be loaded into 
app.use(cookieParser())

// routes import 
import userRouter from "./Routes/user.routes.js"

// routes declaration
app.use("/api/v1/users" , userRouter);

export default app;
