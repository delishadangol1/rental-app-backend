const users = require("../models/user");


const changePassword = async (req, res) => {
  const { currentPassword, newPassword} = req.body;

  try {
    // Ensure the new password and confirm password match
    
    console.log("hit on changepassowrd");
    // Find the user by username
    const user = await users.findById(req.session.users._id);

    if (!user) {
      console.log("user not found");
      return res.status(404).json({ error: "User not found." });
    }

    if (currentPassword != user.password) {
      console.log("incorrect pasword");

      return res.status(400).json({ error: "Old password is incorrect." });
    }

    // Hash the new password and save it
    user.password = newPassword; // The password will be hashed automatically by the 'pre-save' hook

    // Save the updated user
    await user.save();
    console.log("successfull");
    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

module.exports = { changePassword };
