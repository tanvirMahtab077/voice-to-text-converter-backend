const Employee = require("../model/EmployeeModel");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
try{
  const foundEmployee = await Employee.findOne({ email }).exec();
  
  if (!foundEmployee) {
    return res
      .status(401) //Unauthorized
      .json({ message: "Employee does not exist. Please register yourself" });
  }

  const isMatch = await foundEmployee.isValidPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: "Password does not match" });
  }
  if (isMatch) {
    const role = foundEmployee.role;
    // create JWTs
    const accessToken = jwt.sign(
      {
        name: foundEmployee.name,
        email: foundEmployee?.email,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const refreshToken = jwt.sign(
      {
        name: foundEmployee.name,
        email: foundEmployee?.email,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // foundEmployee.refreshToken = refreshToken;
    // await foundEmployee.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        userId:foundEmployee.userId,
        name:foundEmployee.name,
        email:foundEmployee.email,
        role
      },
      accessToken,
    });
  } else {
    res.status(401).json({ message: "Password incorrect" });
  }
}catch(error){
  console.error(err);
    res.status(401).json({
      message: "User not created successful",
      error: err.message,
    });
}
 
};

module.exports = { handleLogin };
