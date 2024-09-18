const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const EmployeeModelSchema = new Schema({
  userId:{
    type:String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type:String
  },
  approval:{
    type:Boolean,
    default: false
  },
  createdAt: {
    type: String,
    default: dayjs().format("YYYY-MM-DD hh:mm:ss"),
  },
});

EmployeeModelSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

EmployeeModelSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Employee = mongoose.model("user", EmployeeModelSchema); // change to singular

module.exports = Employee;