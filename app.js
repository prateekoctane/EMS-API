const express = require("express")
const app = express()
const dotenv = require("dotenv")
const { connection } = require("./db/db");
const { adminRouter } = require("./routes/adminusers");
const  PORT = process.env.PORT || 8080;
dotenv.config();

app.use("/adminusers",adminRouter)


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