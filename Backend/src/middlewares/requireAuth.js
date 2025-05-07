//Function that will take an incoming request and do some preprocessing on the request
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers; //Pull off authorization from request header, authorization will include JWT

    if(!authorization) {
        return res.status(401).send({ error: "You must be logged in." }); //401 is a forbidden error
    }

    const token = authorization.replace("Bearer ", ""); //Removing the Bearer string from JWT

    //Err stores error if an error occurs
    //Payload will give us the information stored into the JWT (which will be an id)
    jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You must be logged in. "});
        }

        //No errors found, now get the userId from payload
        const { userId } = payload;
        //Find the user with matching ID, once found, assign that user to the user variable so we know who made the request
        const user = await User.findById(userId); 
        //Assign user to person making the request
        req.user = user;
        next();
    });
};