const express = require("express");
const AdminUser = require("../models/AdminUser");
const auth = require("../middleware/auth");

const adminRouter = express.Router();

adminRouter.post("/insert", auth, async (req, res) => {
  // Create a new user
  try {
    const { username, pwd, role } = req.body;
    console.log("admin user",  username, pwd, role);
    const adminuser = new AdminUser({
      username,
      pwd,
      role,
    });
    await adminuser.save();
    const token = await adminuser.generateAuthToken();
    console.log("token", token);
    const response = { username: adminuser.username, token: token };
    console.log("response", response);
    res.send({
      status: 1,
      message: "User registered successfully.",
      data: response,
    });
  } catch (error) {
    if (error.message.includes("duplicate key")) {
      if (error.message.includes("username:")) {
        res.send({ status: 0, message: "Username already exists.", data: "" });
      } else {
        res.send({
          status: 0,
          message: "User for selected employee already exists.",
          data: error,
        });
      }
    } else {
      res.send({ status: 0, message: "Something went wrong.", data: "" });
    }
  }
});

adminRouter.post("/login", async (req, res) => {
  try {
    const { username, pwd } = req.body;
    const adminuser = await AdminUser.login(username, pwd);
    if (!adminuser) {
      return res.send({
        error: "Login failed! Check authentication credentials",
      });
    }
    const token = await adminuser.generateAuthToken();
    const response = {
      username: adminuser.username,
      role: adminuser.role,
      token: token,
    };
    res.send({ status: 1, message: "Login successful.", data: response });
  } catch (error) {
    res.send({ status: 0, message: error.message, data: "" });
  }
});

adminRouter.post("/get", auth, async (req, res) => {
  try {
    res.send({
      status: 1,
      message: "Query executed successfully.",
      data: req.adminuser,
    });
  } catch (error) {
    res.send({ status: 0, message: "Query execution error.", data: "" });
  }
});

adminRouter.post("/getall", auth, async (req, res) => {
  try {
    if (req.adminuser.role !== "Owner") {
      return res.send({
        status: 0,
        message: "You are not authorized to access user details.",
        data: "",
      });
    }
    const adminusers = await AdminUser.find({
      role: { $ne: "Owner" },
    }).sort({ createdAt: -1 });
    if (!adminusers) {
      return res.send({
        status: 0,
        message: "Query execution error.",
        data: "",
      });
    }

    let obj = [];

    for (i = 0; i < adminusers.length; i++) {
      let o = {
        _id: adminusers[i]._id,
        username: adminusers[i].username,
        role: adminusers[i].role,
      };
      obj.push(o);
    }

    res.send({
      status: 1,
      message: "Query executed successfully.",
      data: obj,
    });
  } catch (error) {
    res.send({ status: 0, message: "Query execution error.", data: "" });
  }
});



adminRouter.post("/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.adminuser.tokens = req.adminuser.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.adminuser.save();
    res.send({ status: 1, message: "Logout successfully.", data: "" });
  } catch (error) {
    res.send({ status: 0, message: "Something went wrong.", data: "" });
  }
});




adminRouter.post("/update", auth, async (req, res) => {
  try {
    const { username, role } = req.body;
    const adminuser = await AdminUser.findOneAndUpdate(
      { username },
      { role },
      { new: true }
    );

    if (!adminuser) {
      res.send({ status: 0, message: "Something went wrong.", data: "" });
    } else {
      res.send({
        status: 1,
        message: "User updated successfully.",
        data: adminuser,
      });
    }
  } catch (error) {
    res.send({ status: 0, message: "Something went wrong.", data: "" });
  }
});


module.exports = { adminRouter };
