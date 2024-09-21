const Employee = require("../model/EmployeeModel");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None"});
  res.json({ message: "Cookie cleared" });
};

module.exports = { handleLogout };
