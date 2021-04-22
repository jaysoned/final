const express = require("express");
const mongoose = require('mongoose');
const argon2 = require("argon2");

const router = express.Router();


// User schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    profilePic: {
        type: String,
        default: "default"
    },
    password: String,
    role: {
        type: String,
        default: ""
    },
});



// hook called before saving
userSchema.pre('save', async function (next) {

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password'))
        return next();

    try {
        // generate a hash. argon2 does the salting and hashing for us
        const hash = await argon2.hash(this.password);
        // override the plaintext password with the hashed one
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// compares sent password with hash
userSchema.methods.comparePassword = async function (password) {
    try {
        // note that we supply the hash stored in the database (first argument) and
        // the plaintext password. argon2 will do the hashing and salting and
        // comparison for us.
        const isMatch = await argon2.verify(this.password, password);
        return isMatch;
    } catch (error) {
        return false;
    }
};


//hook to delete password from sent user objects
userSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
} //possible error

// middleware function to check for logged-in users
const validUser = async (req, res, next) => {
    if (!req.session.userID)
        return res.status(403).send({
            message: "not logged in"
        });
    try {
        const user = await User.findOne({
            _id: req.session.userID
        });
        if (!user) {
            return res.status(403).send({
                message: "not logged in"
            });
        }
        // set the user field in the request
        req.user = user;
    } catch (error) {
        // Return an error if user does not exist.
        return res.status(403).send({
            message: "not logged in"
        });
    }

    // if everything succeeds, move to the next middleware
    next();
};

// User model
const User = mongoose.model('User', userSchema);

// create a new user
router.post('/', async (req, res) => {
    // Make sure that the form coming from the browser includes all required fields,
    // otherwise return an error. A 400 error means the request was
    // malformed.
    if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password)
        return res.status(400).send({
            message: "first name, last name, username and password are required"
        });

    try {

        //  Check to see if username already exists and if not send a 403 error. A 403
        // error means permission denied.
        const existingUser = await User.findOne({
            username: req.body.username
        });
        if (existingUser)
            return res.status(403).send({
                message: "username already exists"
            });

        // create a new user and save it to the database
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        });
        await user.save();
        // set user session info
        req.session.userID = user._id;

        // send back a 200 OK response, along with the user that was created
        return res.send({
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// login a user
router.post('/login', async (req, res) => {
    // Make sure that the form coming from the browser includes a username and a
    // password, otherwise return an error.
    if (!req.body.username || !req.body.password)
        return res.status(400).send({
            message: "username and password required"
        });

    try {
        //  lookup user record
        const user = await User.findOne({
            username: req.body.username
        });
        // Return an error if user does not exist.
        if (!user)
            return res.status(403).send({
                message: "username or password is wrong"
            });

        // Return the SAME error if the password is wrong. This ensure we don't
        // leak any information about which users exist.
        if (!await user.comparePassword(req.body.password))
            return res.status(403).send({
                message: "username or password is wrong"
            });

        // set user session info
        req.session.userID = user._id;

        return res.send({
            user: user
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get logged in user
router.get('/', validUser, async (req, res) => {
    try {
        res.send({
            user: req.user
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// logout
router.delete("/", validUser, async (req, res) => {
    try {
        req.session = null;
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
    dest: '../front-end/public/images/',
    limits: {
        fileSize: 50000000
    }
});

// change photo
router.put('/photo', validUser, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                message: "Must upload a file."
            });
        }
        let user = req.user;
        user.profilePic = "/images/" + req.file.filename;
        await user.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/photo", validUser, async(req, res) =>{
    try {
        res.send({
            photo: req.user.profilePic
        });
    }
    catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.put("/", validUser, async(req, res) => {
    try {
        let user = req.user;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        await user.save();
        return res.sendStatus(200);
    }
    catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
});



module.exports = {
    routes: router,
    model: User,
    valid: validUser
};