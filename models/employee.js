const mongoose = require("mongoose");
const validator = require("validator");

const employeeSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  lastname: {
    type: String,
    required: true,
    trim: true
  },

  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password:{
    type: String,
    required:true,
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

const employeeModel = mongoose.model("employees", employeeSchema);
module.exports = employeeModel;
