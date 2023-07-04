const express = require("express");
const app = express();
const cors =require("cors");
const dotenv = require("dotenv");
const { adminRouter } = require("./routes/adminusers");
const employee = require("./routes/employee");
const {shiftRouter} = require("./routes/shifts");
const { connection } = require("./db/db");
const holiday = require("./routes/holidays")


app.use(express.json());
app.use(cors({origin:"*"}));
app.use("/adminusers",adminRouter)
app.use("/employees",employee)
app.use("/shift",shiftRouter)
app.use("/holidays",holiday)

const  PORT = process.env.PORT || 8080;
dotenv.config();

app.get("/", async(req,res)=>{
    try{
        res.send("Home")
    }catch(error){
        res.send({ "msg":"Something went Wrong","error":error.message })
    }
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
app.listen(PORT, async(req,res)=>{
    try{
        await connection;
        console.log("Backend is running on " + PORT);
    }catch(error){
        console.log("Cant connect to Database");
    }
})