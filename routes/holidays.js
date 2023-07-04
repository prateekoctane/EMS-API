const express = require("express")
const auth = require("../middleware/auth")
const Holidays = require("../models/Holiday")
const holiday = express.Router()

holiday.post("/insert", auth, async(req,res)=>{
    
    try {
        const {name, from_date, to_date }= req.body;
        const obj = new Holidays({
            name, 
            from_date, 
            to_date
        })   
        const holiday = await obj.save();
        if(!holiday){
            res.send({
                status:0,
                message:"Something went wrong",
                data:"",
            });
        }res.send({
            status:1,
            message:"Holiday Added Successsfuly",
            data: holiday,
        })
    } catch (error) {
        if(error.message.includes("duplicate Key")){
            if (error.message.includes("name")){
                res.send({ status:0, message:"Name already exists", data:"", })
            }
        }else {
            res.send({ status:0, message:error.message, data:error})
        }
    }
});

//getall
holiday.post("/getall",auth, async (req,res)=>{
    try {
        const holiday = await Holidays.find();
        if(!holiday){
            res.send({
                status: 0,
                message: "No Data Found!",
                data: "",
            });
        }
        res.send({
            status: 1,
            message: `Total ${holiday.length} Records Success`,
            data:holiday,
        })
    } catch (error) {
        res.send({
            status: 0,
            message:`Error Occured!${error}`,
            data:""
        })
    }
}) 

module.exports = holiday