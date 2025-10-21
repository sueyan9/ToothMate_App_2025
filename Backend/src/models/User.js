const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Defining a User type
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true, //mongoose will understand we want every email to be unique, error if duplicate attempted
    required: true,
  },
  nhi: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  children: [{  type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dob: {
    type: Date,
    required: true,
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  profile_picture: {
    type: Number,
    default: null
  },
  signup_code: {
    type: String,
    default: null
  },
  insurance: {
    type: String,
    default: null
  },
  insurance_number: {
    type: String,
    default: null
  },
  restricted_access: {
    type: Boolean,
    default: false
  },
  allergy: {
    type: String,
    default: null
  },
  emergency_name: {
    type: String,
    default: null
  },
  emergency_phone: {
    type: String,
    default: null
  },
});

//Pre-save hook that automatically runs before we save a user
//Salting and Hashing the password
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//Candidate password is what the user is trying to login with
userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;

  //If something goes wrong while comparing password, reject promise else resolve
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
