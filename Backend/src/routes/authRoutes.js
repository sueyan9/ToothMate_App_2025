const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

const router = express.Router();

//Whenever someone makes a POST request to /signup, the following callback function will be called
router.post("/signup", async (req, res) => {
  const { firstname, lastname, email, nhi, password, dob, clinicCode  } = req.body; //req.body contains the user sign up details
  try {
    // find the clinic
    const foundClinic = await mongoose.model("Clinic").findOne({ code: clinicCode });

    if (!foundClinic) {
      return res.status(400).send({ error: "Invalid clinic code." });
    }

    // create new user and linked with clinic
    const user = new User({
      firstname,
      lastname,
      email,
      nhi,
      password,
      dob,
      clinic: foundClinic._id.toString(), // save clinic ID
    });
 //creating instance of user
    await user.save(); //saves the user - async operation to save user to DB

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY"); //creating JWT, assigning it its id from the DB to the token
    res.send({ token, id: user._id });
  } catch (err) {
    return res.status(422).send(err.message); //422 indicates user sent us invalid data
  }
});

router.post("/completeRegistration", async (req, res) => {
  const { signupCode, nhi, email, password, patientId } = req.body;
  
  try {
    // Verify the signup code and patient ID match
    const patient = await User.findOne({ 
      _id: patientId, 
      signup_code: signupCode.toUpperCase() 
    });
    
    if (!patient) {
      return res.status(422).send({ error: "Invalid signup code or patient ID" });
    }
    
    // Verify NHI matches
    if (patient.nhi.toUpperCase() !== nhi.toUpperCase()) {
      return res.status(422).send({ error: "NHI does not match our records" });
    }
    
    // Check if registration is already completed
    if (patient.email && patient.password) {
      return res.status(422).send({ error: "Registration already completed" });
    }
    
    // Check if email is already used by another user
    const existingEmailUser = await User.findOne({ 
      email: email.toLowerCase(),
      _id: { $ne: patientId } // exclude current patient
    });
    
    if (existingEmailUser) {
      return res.status(422).send({ error: "Email already in use" });
    }
    
    // Hash password before saving
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update the patient record with email and password
    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      {
        email: email.toLowerCase(),
        password: hashedPassword,
        // Optionally remove the signup_code after successful registration
        $unset: { signup_code: "" }
      },
      { new: true }
    );
    
    // Generate JWT token for automatic login
    const token = jwt.sign({ userId: updatedPatient._id }, "MY_SECRET_KEY");
    
    res.send({ 
      token, 
      id: updatedPatient._id,
      user: {
        firstname: updatedPatient.firstname,
        lastname: updatedPatient.lastname,
        email: updatedPatient.email,
        nhi: updatedPatient.nhi
      }
    });
    
  } catch (err) {
    console.error("Complete registration error:", err);
    return res.status(422).send({ error: err.message || "Registration failed" });
  }
});

router.post("/disconnectchild", async (req, res) => {
  const id = req.body.id;
  const parent = await User.findById(id, "parent");
  const parentId = parent.parent;
  await User.findByIdAndUpdate(id, { parent: null });
  await User.findByIdAndUpdate(parentId, { $pull: { children: id } });
  res.send();
});

router.post("/signupchild", async (req, res) => {
  const { firstname, lastname, email, nhi, password, dob, clinic, parent } =
    req.body;

  try {
    const user = new User({
      firstname,
      lastname,
      email,
      nhi,
      password,
      parent,
      dob,
      clinic,
    });
    await user.save();
    await User.findByIdAndUpdate(parent, {
      $push: { children: user._id },
    });

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");

    res.send({ token, id: user._id, parentId: parent });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.get("/checkSignupCode/:code", async (req, res) => {
  try {
    const signupCode = req.params.code.toUpperCase();
    const patient = await User.findOne({ signup_code: signupCode });
    
    if (patient) {
      // Check if patient already has email and password (already completed registration)
      if (patient.email && patient.password) {
        res.json({ 
          valid: false, 
          error: "Registration already completed for this code" 
        });
      } else {
        res.json({ 
          valid: true, 
          patient: {
            _id: patient._id,
            firstname: patient.firstname,
            lastname: patient.lastname,
            nhi: patient.nhi,
            dob: patient.dob,
            clinic: patient.clinic
          }
        });
      }
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Error checking signup code" });
  }
});


router.post("/signin", async (req, res) => {
  const { emailOrNhi, password } = req.body;

  if (!emailOrNhi || !password) {
    return res.status(422).send({ error: "Must provide email/nhi and password" });
  }

  try {
    const user = await User.findOne({
      $or: [
        {email: emailOrNhi.toLowerCase()},
        {nhi: emailOrNhi.toUpperCase()}
      ]
    });

    if (!user) {
      return res.status(422).send({error: "Invalid login credentials."});
    }

    await user.comparePassword(password);

    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token, id: user._id, user });
  } catch (err) {
    return res.status(422).send({ error: "Invalid login credentials." });
  }
});

router.post("/user", async (req, res) => {
  const token = req.body.token;
  const userId = jwt.decode(token);

  const user = await User.findOne({ _id: userId.userId });

  res.send({ token, user });
});

router.get("/getchildaccounts/:id", async (req, res) => {
  const id = req.params.id;
  const childrenid = await User.findById(id, "children");
  let children = [];
  if (childrenid) {
    for (let i = 0; i < childrenid.children.length; ++i) {
      child = await User.findById(childrenid.children[i]);
      children.push(child);
    }
  }
  res.send(children);
});

//Whenever someone opens education screen, give the date of birth to the code to find out their age range
router.get("/getDOB/:id", (req, res) => {
  const id = req.params.id;

  const user = User.findOne({ _id: id })
    .then((user) => res.json({ dob: user.dob }))
    .catch((err) => res.status(404).json({ error: "No topics found" }));
});

router.get("/isChild/:id", (req, res) => {
  const id = req.params.id;

  const user = User.findOne({ _id: id })
    .then((user) => res.json({ isChild: user.parent != null }))
    .catch((err) => res.status(404).json({ error: "Error" }));
});

router.get("/getNhi/:id", (req, res) => {
  const id = req.params.id;

  User.findOne({ _id: id })
    .then((user) => res.json({ nhi: user.nhi }))
    .catch((err) => res.status(404).json({ error: "No nhi found" }));
});

router.get("/getUserClinic/:id", (req, res) => {
  const id = req.params.id;

  const user = User.findOne({ _id: id })
    .then((user) => res.json({ clinic: user.clinic }))
    .catch((err) => res.status(404).json({ error: "No email found" }));
});

router.get("/user/:id", (req, res) => {
  const id = req.params.id;

  console.log("get user from app", id);
  const user = User.findOne({ _id: id })
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ error: "No email found" }));
});

router.put("/updateUser/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ error: "" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.put("/updateUserClinic/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ error: "" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.put("/changePassword/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.params.id;

  if (!oldPassword) {
    return res.status(422).send({ error: "Must provide current password" });
  }

  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    const match = await user.comparePassword(oldPassword);

    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return err;
      }

      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          return err;
        }
        User.updateOne({ _id: id }, { password: hash }).then(() =>
          res.json({})
        );
      });
    });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password" });
  }
});

// get saved profile picture
router.put("/updateProfilePicture/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { profile_picture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { profile_picture },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      success: true, 
      profile_picture: user.profile_picture 
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
});

// Route to check if NHI already exists
router.get("/checkNhi/:nhi", async (req, res) => {
  try {
    const nhi = req.params.nhi.toUpperCase();
    const existingUser = await User.findOne({ nhi: nhi });
    
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Error checking NHI" });
  }
});

// Route to check if email already exists
router.get("/checkEmail/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Error checking email" });
  }
});
// =========forgetpassword======
//check user by email/NHI
router.post("/findUserByEmailOrNhi", async (req, res) => {
  const { emailOrNhi } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrNhi.toLowerCase() },
        { nhi: emailOrNhi.toUpperCase() }
      ]
    });

    if (user) {
      res.json({ user: { _id: user._id, firstname: user.firstname, lastname: user.lastname } });
    } else {
      res.json({ user: null });
    }
  } catch (err) {
    res.status(500).json({ error: "Error finding user" });
  }
});

// 2. verify signup code ,usring this for reset
router.post("/verifySignupCodeForReset", async (req, res) => {
  const { userId, signupCode } = req.body;

  try {
    const user = await User.findOne({
      _id: userId,
      signup_code: signupCode.toUpperCase()
    });

    if (user) {
      res.json({ valid: true });
    } else {
      res.json({ valid: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Error verifying code" });
  }
});

// reset pin
router.post("/resetPassword", async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // same as signup logic
    if (newPassword === '') {
      return res.status(422).json({ error: "Please enter your password" });
    }

    if (newPassword.length < 8) {
      return res.status(422).json({ error: "Password must be at least 8 characters" });
    }

    if (newPassword === newPassword.toLowerCase()) {
      return res.status(422).json({ error: "Please enter a password with at least one capital letter" });
    }

    if (!/\d/.test(newPassword)) {
      return res.status(422).json({ error: "Please enter a password with at least one number" });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newPassword)) {
      return res.status(422).json({ error: "Please enter a password with at least one special character" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // update new pin
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      $unset: { signup_code: "" } //  clean signup code
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Error resetting password" });
  }
});
module.exports = router;
