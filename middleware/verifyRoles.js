const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
      // if (!req.body?.role) {
      //   return res.sendStatus(401);
      // }
      
      const roleArray = [...allowedRoles];
      // console.log(req.body?.roles);
      const result = roleArray.includes(req.role)
      if (!result) {
        return res.status(401).send('Unauthorized User');
      }
  
      next();
    };
  };
  
  module.exports = verifyRoles;
  