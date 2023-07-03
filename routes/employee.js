const express = require("express");
const employeeModel = require("../models/employee");
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
  const { firstname, lastname, code,password } = req.body;
  const image_url=req.file; 
  try{  
        
    const hashedPassword = await bcrypt.hash(password,5)
    const obj = new employeeModel({
            firstname,
            lastname,
            code,
            password: hashedPassword,
           // image_url: image_url.path, 
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
            if (error.message.includes("firstname")) {
              res.send({ status: 0,message: "Name already exists.", data: "",  });
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
      const employee = await employeeModel.find();
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
    const employee = await employeeModel.findById(id)
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

// Email Seervice
employee.post('/send-email', async (req, res) => {
  const { email } = req.body;
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    // Configure the email service provider here
    // For example, if using Gmail:
    service: 'Gmail',
    auth: {
      user: 'talhamohd2376@gmail.com', // Replace with your email address
      pass: '22092000Ta@g', // Replace with your email password or app password for Gmail
    },
  });

  // Construct the email message
  const mailOptions = {
    from: 'talhamohd2376@l@gmail.com', // Replace with your email address
    to: email,
    subject: 'Form Submission Confirmation',
    text: `Hello Talha,\n\nThank you for your form submission. We have received your message: ${message}\n\nRegards,\nYour Company`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log('Email sent successfully');
 try{
  res.json({ status: 1, message: 'Email sent successfully' });
} catch (error) {
  console.error('Error sending email:', error);
  res.status(500).json({ status: 0, message: 'Failed to send email' });
}
});

module.exports = employee