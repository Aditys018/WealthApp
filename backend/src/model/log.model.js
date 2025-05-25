const mongoose = require("mongoose");

// Define the Mongoose schema for logs
const logSchema = new mongoose.Schema(
  {
    userId: { type: String, required: false }, // User ID from JWT (optional)
    route: { type: String, required: true }, // Accessed route
    method: { type: String, required: true }, // HTTP method
    query: { type: Object, required: false }, // Query parameters
    body: { type: Object, required: false }, // Request body (for POST requests)
    timestamp: { type: Date, default: () => new Date() }, // Timestamp of the request
  },
  { timestamps: true } // Automatically handles createdAt & updatedAt
);

const Log = mongoose.model("Log", logSchema);

module.exports = { Log };