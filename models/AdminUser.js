const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminuserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    pwd: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [
      {
        _id: false,
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminuserSchema.pre("save", async function (next) {
  // Hash the password before saving the user model
  const adminuser = this;
  if (adminuser.isModified("pwd")) {
    adminuser.pwd = await bcrypt.hash(adminuser.pwd, 9);
  }
  next();
});

adminuserSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const adminuser = this;
  const token = jwt.sign({ _id: adminuser._id }, process.env.JWT_KEY);
  adminuser.tokens = adminuser.tokens.concat({ token });
  await adminuser.save();
  return token;
};

adminuserSchema.statics.login = async (username, pwd) => {
  const adminuser = await AdminUser.findOne({ username });
  if (!adminuser) {
    throw new Error("Invalid credentials.");
  }
  const isPasswordMatch = await bcrypt.compare(pwd, adminuser.pwd);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials.");
  }
  return adminuser;
};

const AdminUser = mongoose.model("adminusers", adminuserSchema);

module.exports = AdminUser;
