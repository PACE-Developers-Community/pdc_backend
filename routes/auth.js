const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const User = require('../model/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const fetchUser = require("../middleware/fetchUser");

const jwtkey = "azlanisagoodboy";

/// route 1 create user   /api/auth/createuser

router.post('/createuser',[
    body('name', 'Name length must be atleast 3 character').isLength({ min: 3 }),
    body('email', 'enter valid email').isEmail(),
    body('password','Password length must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
  let  success=false;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }
try{
    let user =  await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error : "user already exists"})
    }
    const salt = await bcrypt.genSalt(10);
    SecPass = await bcrypt.hash(req.body.password, salt) ;

    user = await User.create({
        name: req.body.name,
        password: SecPass,
        phone: req.body.phone,
        email: req.body.email,
      });
      const data ={
        user:{
            id:user.id
        }
      }
      const authtoken = jwt.sign(data,jwtkey )


      success = true;
      res.json({success, authtoken})
        
      }
    
    catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
       }

    
}
);



// route 2 authenticate user   /api/auth/createuser

router.post('/login',[
    body('email', 'enter valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),

], async (req, res) => {
 let  success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });      }
          const {  email,  password } = req.body;
          try {
            let user = await User.findOne({email});
            if(!user){
              success=false;
                return res.status(400).json({success, error: "invalid user"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
              success=false;
                return res.status(400).json({success, error: "invalid credentials"});
            }

            const data ={
                user:{
                    id:user.id
                }
              }
              
              const authtoken = jwt.sign(data,jwtkey )
               success =true;
              res.json({success, authtoken})

          } catch (error) {
           console.error(error.message);
           res.status(500).send("internal server error from auth.js");
          }

})



// route 3: get user details   /api/auth/getUser
router.post('/getUser', fetchUser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error");
    }
  });
  




module.exports = router;




