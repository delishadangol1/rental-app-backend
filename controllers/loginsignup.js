const collection = require("../models/user");
const session = require("express-session");

const login = async (req, res) => {
  console.log("login backend");
  try {
    const check = await collection.findOne({ name: req.body.name });

    if (!check) {
      return res.send("User not found");
    }

    if (check.password === req.body.password) {
      req.session.users = check; // Store user in session
      console.log("Session set:", req.session.users); // Log session data to debug
      res.json({message:'succesfull',user:req.session.users});
    } else {
      res.json({message:'unsuccesful'});

    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({message:'unsuccesful'});

  }
};

const signup = async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };

  await collection.insertMany([data]);
  res.render("home"); //redirect to the home page
};

module.exports = {
  login,
  signup,
};
