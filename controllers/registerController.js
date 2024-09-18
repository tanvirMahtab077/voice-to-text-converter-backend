const { restart } = require("nodemon");
const Employee = require("../model/EmployeeModel");
const { v4: uuidv4 } = require('uuid');

const handleRegisterNewEmployee = async (req, res) => {
  const { name,email,password } = req.body;
  const isEmployeeExist = await Employee.findOne({ email }).exec();

  if(isEmployeeExist){
    return res
      .status(409)
      .json({ message: "This email already exist. Please log in" });
  }

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, Email and password are required." });
  }

  try {
    const employee = new Employee({
      ...req.body,
      role: 'User',
      userId:uuidv4().replace(/-/g, '').slice(0, 5)
    });
    await employee.save();

    res
      .status(201)
      .json({ message: "Registered successfully - please log in" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong. Please register again" });
  }
};

module.exports = { handleRegisterNewEmployee };
