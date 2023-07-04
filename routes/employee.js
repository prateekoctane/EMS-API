const express = require("express");
const Employees = require("../models/Employees");
const auth = require("../middleware/auth");
const employee = express.Router();
const multer = require("multer");
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

//uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  const fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PDF files are allowed.'), false);
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });

// employee.post('/upload', upload.single('image_url'), (req, res) => {
//     // Access the uploaded file via req.file
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }
  
//     // Process the uploaded file and store the necessary data in the database
  
//     return res.status(200).json({ message: 'Image uploaded successfully' });
//   });
  

//insert
employee.post("/insert",upload.single("image_url"), async(req,res)=>{
  const { name, code, email , designation, salary, aadhar, pan, date_of_birth, date_of_joining, mobile, } = req.body;
  const image_url=req.file; 
  try{   
        const obj = new Employees({
            name,
            code,
            email,
            designation,
            salary, 
            aadhar, 
            pan,
            date_of_birth, 
            date_of_joining, 
            mobile,
            image_url: image_url, 
        });
         const employee = await obj.save();
         if (!employee) {
            res.send({
              status: 0,
              message: "Something went wrong",
              data: "",
            });
          }
          res.send({
            status: 1,
            message: "Employee inserted Successfully.",
            data: employee,
          });
    }catch(error){
        if (error.message.includes("duplicate key")) {
            if (error.message.includes("name")) {
              res.send({ 
                status: 0,
                message: "Name already exists.", 
                data: "",  
              });
            } else if(error.message.includes("code")){
                res.send({
                    status: 0,
                    message: "Employee code already exists.",
                    data: "",
                  });
            }
          } else {
            res.send({ status: 0, message: error.message, data: error });
          }
    }
})

//getall
employee.post("/getall", auth, async (req, res) => {
    try {
      const employee = await Employees.find();
      if (!employee) {
        res.send({
          status: 0,
          message: "Something went wrong.",
          data: "",
        });
      }
      res.send({
        status: 1,
        message: "Query executed Successfully.",
        data: employee,
      });
    } catch (error) {
      res.send({ status: 0, message: "Something went wrong.", data: "" });
    }
  });


//update Password
employee.post("/updatePassword", auth, async(req,res)=>{

  const { id, oldpass , newpass } = req.body;
  try{
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid employee ID.' });
    }
    const employee = await Employee.findById(id)
    if(!employee){
      return res.status({ status: 0, message: "Employee not found"})
    }
    const passwordmatch = await bcrypt.compare(oldpass, employee.password)
    if(!passwordmatch){
      return res.status({status: 1, message: "current passwordis incorrect"})
    }
    const hashedPassword = await bcrypt.hash(newpass, 5);
    employee.password = hashedPassword;
    await employee.save();

  }catch(error){
 res.send({ status: 0, message: error.message, data: error });
  }
})


module.exports = employee