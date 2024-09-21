const Employee = require("../model/EmployeeModel");
var validator = require("email-validator");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const isValidEmail = validator.validate(email);
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be less than 6 characters" });
  }
  if (!name) {
    return res.status(400).json({ message: "User name is required" });
  }
  if (!isValidEmail) {
    return res.status(400).json({ message: "Email not valid" });
  }
  try {
    const findUser = await Employee.find({ email });

    if (findUser.length === 0) {
      const user = await User.create({
        ...req.body,
        role: "User",
        userId: uuidv4().replace(/-/g, "").slice(0, 5),
      });
      res.status(200).json({
        message: "User successfully created",
      });
    } else {
      res.status(400).json({ message: "User already exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "User not created successful",
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }
  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please Register....",
      });
    }

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password does not match" });
    }

    const accessToken = jwt.sign(
      {
        name: user.name,
        email:user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );

    const refreshToken = jwt.sign(
      {
        name: user.name,
        email:user.email,
        role: user.role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Successfully Logged In", accessToken });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "An error occurred",
      error: err.message,
    });
  }
};

exports.refreshToken = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const user = await Employee.findOne({
        email: decoded.email,
      }).exec();

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          userName: user.userName,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );

      res.json({ accessToken });
    }
  );
};

// exports.logout = (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(204); //No content
//   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
//   res.json({ message: "Cookie cleared" });
// };
