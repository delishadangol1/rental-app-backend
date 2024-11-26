const Property = require("../models/property");

const addPost = async (req, res) => {
  const {
    title,
    price,
    address,
    description,
    googleMapLink,
    contacts="9999999999",
    video,
    facilities="washroom",
    status,
  } = req.body;

  // Get file path if an image was uploaded
  const propertyPictures = req.file
    ? `/uploads/propertyPictures/${req.file.filename}`
    : "";

  // Prepare the property data
  const newProperty = new Property({
    title,
    price,
    address,
    description,
    googleMapLink,
    contacts: contacts.split(",").map((contact) => contact.trim()), // Convert contacts to an array
    video,
    facilities: facilities.split(",").map((facility) => facility.trim()), // Convert facilities to an array
    status,
    propertyPictures,
  });

  try {
    // Save the new property to the database
    await newProperty.save();

    res.status(200).json({message:'succesfull'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message:'unsuccesfull'});
  }
};

const editProperty = async (req, res) => {
  const propertyId = req.params.id; // Get the property ID from the URL

  try {
    // Fetch the property from the database

    const property = await Property.findOne({ _id: propertyId });

    if (!property) {
      return res.status(404).send("Property not found");
    }
    console.log("founf!!!!!");
    property.isAvailable = property.status === "Available";
    property.isBooked = property.status === "Booked";
    // Render the form and pass the property data to the view
    res.render("editProperty", { property });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching property");
  }
};

const savePost = async (req, res) => {
    console.log("Request received:");
  const {
    propertyId,
    title,
    price,
    address,
    description,
    googleMapLink,
    contacts,
    video,
    facilities,
    status,
  } = req.body;
  // Check if a new image file is uploaded
  const newPropertyPicturePath = req.file
    ? `/uploads/propertyPictures/${req.file.filename}`
    : null;
    // console.log(`name ${req.file.filename}`);
    if(req.file){
      console.log('file is not emopty');
    }
  try {
    // Find the property by ID
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({message:error});
    }

    // Update property details
    property.title = title;
    property.price = price;
    property.address = address;
    property.description = description;
    property.googleMapLink = googleMapLink;
    property.contacts = contacts
      ? contacts.split(",").map((c) => c.trim())
      : [];
    property.video = video;
    property.facilities = facilities
      ? facilities.split(",").map((f) => f.trim())
      : [];
    property.status = status;

    // Update `propertyPictures` only if a new file was uploaded
    if (newPropertyPicturePath) {
      property.propertyPictures = newPropertyPicturePath;
    }

    // Save the updated property back to the database
    await property.save();

    res.status(200).json({message:'hello'});
  } catch (error) {
    console.error(error);
    res.status(500).json({'error' : error.message});
  }
};

module.exports = {
  addPost,
  editProperty,
  savePost,
};
