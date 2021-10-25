const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// const { create } = require('../models/User');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Mynameis@Niloy653'

// ROUTE:1 Create a User Using Post Request "/api/auth/createuser". No Login Required 
router.post('/createuser', [
    body('name', "Name must be contain at least 5 letter").isLength({ min: 5 }),
    body('email', "Enter a valid Email").isEmail(),
    body('phone', "Enter a valid Phone No").isMobilePhone(),
    body('userName', "UserName must be contain at least 5 charecters").isLength({ min: 5 }),
    body('password', "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    })
], async (req, res) => {
    let success = false;
    // If there are Errors, return Bad Request and the Errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // Check whether the User with this Email and Phone no exists already 
    try {
        let userName = await User.findOne({ userName: req.body.userName });
        let userEmail = await User.findOne({ email: req.body.email });
        let userPhone = await User.findOne({ phone: req.body.phone });
        if (userName || userEmail || userPhone) {
            return res.status(400).json({success, error: "Sorry A User With This UserName, Email or Phone Number is Already Exists" })
        }
        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt);

        // create a New User 
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            userName: req.body.userName,
            password: secPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

//ROUTE:2 Authenticate a User using: POST "/api/auth/login". No Login Required 
router.post('/login', [
    body('userName', "Enter Your UserName Correctly").isLength({ min: 5 }),
    body('password', "Password Can't be Blank").exists()
], async (req, res) => {
    let success = false;
    // If there are Errors, return Bad Request and the Errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,  errors: errors.array() });
    }

    const { userName, password } = req.body;
    try {
        let user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ success, error: "Please Try to Login with Correct Credentials!" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please Try to Login with Correct Credentials!" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authToken })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

// ROUTE:3 Get Login User Details using: POST "/api/auth/getuser". Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
})
module.exports = router;