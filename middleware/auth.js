const jwt = require("jsonwebtoken");
const { user } = require("textmagic-rest-client/resources");
const session = require('express-session')
const config = process.env;
module.exports  = {
  async verifyToken(req, res, next){
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.session.user_id = decoded.user_id
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  }
}