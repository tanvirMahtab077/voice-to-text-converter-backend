const Employee = require("../model/EmployeeModel");

const handleLogout = async (req, res) => {
  // On client side we have to also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No content to send back
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).send('Logout successful');
};

module.exports = { handleLogout };
