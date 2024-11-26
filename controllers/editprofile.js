const users = require('../models/user');

const editProfile = async (req, res) => {
    try {
        console.log("here in edit profile");
        // Fetch the user using the session data
        const user = await users.findById(req.session.users._id);
        const { name} = req.body;

        if (user) {
            console.log("user found");
            // Update the user fields
            user.name = (name !== null && name !== undefined && name !== '') ? name : user.name;
           

            
            // Save the updated user to the database
            await user.save();
            console.log("success");

            // Redirect to the profile page
             res.status(200);
        } else {
        console.log("user not found");

            return res.status(404).send("Profile not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error editing profile");
    }
};

module.exports = editProfile;
