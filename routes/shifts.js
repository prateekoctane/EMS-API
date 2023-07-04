const express = require("express");
const { shiftModel } = require("../models/Shift");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const shiftRouter = express.Router();


shiftRouter.post("/insert", auth, async (req, res) => {

    try {

        const { in_time, out_time } = req.body;

        const obj = new shiftModel({ shift_name: `${in_time} - ${out_time}`, in_time: in_time, out_time: out_time });

        const newShift = await obj.save();

        if (!newShift) {
            res.send({ status: 0, message: "Something went wrong", data: "" })
        }

        res.send({ status: 1, message: "Shift added successfuly", data: newShift })

    } catch (error) {
        res.send({ status: 0, message: "Something went wrong.", data: "" });
    }

});

shiftRouter.post("/getall", auth, async (req, res) => {

    try {
        const shifts = await shiftModel.find();

        if (!shifts) {
            res.send({ status: 0, message: "Something went wrong.", data: "" })
        }
        res.send({ status: 1, message: "Query executed successfuly.", data: shifts })
    } catch (error) {
        res.send({ status: 0, message: error.message, data: "" });
    }
});

shiftRouter.post("/update", auth, async (req,res) => {

    try{
       const {id, in_time, out_time} = req.body;
       const updatedShift = await shiftModel.findOneAndUpdate({_id: id},{
          in_time:in_time,
          out_time:out_time,
          shift_name:`${in_time} - ${out_time}`
       },{new: true});

       if(!updatedShift){
          res.send({status:0, message: "Something went wrong.", data: ''});
       }
       res.send({status:1, message:"Shift Updated Successfuly.", data: updatedShift})
    }catch(error){
        res.send({status:0, message: error.message, data: ""})
    }
})

shiftRouter.post("/delete", auth, async (req,res) => {

    try{
       const {id} = req.body;
       const deletedShift = await shiftModel.findOneAndDelete({_id: id});

       if(!deletedShift){
          res.send({status:0, message: "Something went wrong.", data: ''});
       }
       res.send({status:1, message:"Shift Deleted Successfuly.", data: deletedShift})
    }catch(error){
        res.send({status:0, message: error.message, data: ""})
    }
})


module.exports = { shiftRouter }