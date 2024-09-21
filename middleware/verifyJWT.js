const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(403).send('Invilid token'); //invalid token - forbidden from access
    }
    req.name = decoded.name;
    req.role = decoded.role;
    req.email = decoded.email;
    next();
  });
};

module.exports = verifyJWT;
