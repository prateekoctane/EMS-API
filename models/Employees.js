const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    date_of_birth: {
      type: Date,
      trim: true,
    },

    date_of_joining: {
      type: Date,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      required: true,
      trim: true,
    },

    aadhar:{
      type:String,
      required: true,
      trim: true,
    },

    pan:{
      type:String,
      required: true,
      trim: true,
    },

     is_active: {
      type: Boolean,
      default: true,
    },

    leave: {
      type: Number,
      default:10,
      trim: true,
    },

    image_url: {
      type: String,
      default: "",
    },
  
  },
  {
    timestamps: true,
  }
);

const Employees = mongoose.model("employees", employeeSchema);
module.exports = Employees;
