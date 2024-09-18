const Employee = require("../model/EmployeeModel");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const foundEmployee = await Employee.findOne({ email }).exec();
  

  if (!foundEmployee) {
    return res
      .status(401) //Unauthorized
      .json({ message: "Employee does not exist. Please register yourself" });
  }

  const isMatch = await foundEmployee.isValidPassword(password);

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
      { expiresIn: "3600s" }
    );

    const refreshToken = jwt.sign(
      { email: foundEmployee?.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // foundEmployee.refreshToken = refreshToken;
    // await foundEmployee.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // one day max age of the cookie
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
};

module.exports = { handleLogin };
