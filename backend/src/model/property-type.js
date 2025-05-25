const mongoose = require("mongoose");

// Define the Mongoose schema for logs
const logSchema = new mongoose.Schema(
  {
    id: { type: String, required: false }, // User ID from JWT (optional)
    key: { type: String, required: true }, // Property type key
  }
);

const PropertyType = mongoose.model("PropertyType", logSchema, "property-type");

module.exports = { PropertyType };