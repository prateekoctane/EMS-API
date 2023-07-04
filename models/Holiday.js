const mongoose = require("mongoose");
const validator = require("validator")

const holidaySchema = mongoose.Schema(
    {
        name:{
            type: String,
            unique:true,
            trim:true,
            required: true,
        },
        from_date:{
            required:true,
            type: Date,
            trim:true,
        },
        to_date:{
            required:true,
            type: Date,
            trim:true,
        }
    },
    { 
        timestamps:true
    }
);

const Holidays = mongoose.model("holidays", holidaySchema);
module.exports = Holidays;