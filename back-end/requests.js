const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./user.js");
const User = users.model;
const validUser = users.valid;

const requestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    shortDescription: String,
    longDescription: {
        type: String,
        default: ""
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateResolved: {
        type: Date,
        default: 0
    },
    resolved: {
        type: Boolean,
        default: false
    },
    room: String,
    response: String,
});

const Request = mongoose.model("Request", requestSchema);

// upload 
router.post("/", validUser, async (req, res) => {
    if (!req.body.shortDescription ||
        !req.body.room) {
        return res.status(400).send({
            message: "Missing field(s)"
        });
    }
    try {
        let request = new Request({
            user: req.user,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            room: req.body.room
        });
        await request.save();
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/all", async (req, res) => {
    try {
        let requests = await Request.find().sort({
            created: -1
        }).populate('user');
        return res.send(requests);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let request = await Request.findOne({
            _id: req.params.id
        }).populate('user');
        if (!request) {
            return res.sendStatus(404);
        }
        return res.send(request);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// get one user's requests
router.get("/", validUser, async (req, res) => {
    // return requests
    try {
        let requests = await Request.find({
            user: req.user
        }).sort({
            created: -1
        }).populate('user');
        return res.send(requests);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Request.deleteOne({
            _id: req.params.id
        })
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.put("/:id", validUser, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({
            message: "must be admin"
        });
    }
    try {
        let request = await Request.findOne({
            _id: req.params.id
        });
        request.dateResolved = Date.now();
        request.resolved = req.body.resolved;
        request.response = req.body.response;
        await request.save();
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});



module.exports = {
    model: Request,
    routes: router,
}