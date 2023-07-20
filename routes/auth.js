const express = require("express");
const User = require('../db/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require("dotenv");
const session = require('express-session')
dotenv.config();
router.post('/create-account', async (req,res)=>{
    let user = new User(req.body);
    const email = user.email;
    const salt = await bcrypt.genSalt(10);
    console.log(user.password);
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then(() => {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY ,
        {
          expiresIn: "2h",
        }
      );
      res.status(201).send({user:user, token:token})});
});
router.post('/login', async (req,res)=>{
    let user = new User(req.body);
    console.log(req.body);
    const body = req.body;
    user = await User.findOne({ email: user.email }).select("+password");
    if (user) {
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        const token = jwt.sign(
          { user_id: user._id,
            email: user.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        user.password = undefined;
        res.status(200).json({user: user, token:token});
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
});
module.exports = router;
