const fs = require("fs");
const path = require("path");
const { Log } = require("../model/log.model"); // Import the Log model

const logFilePath = path.join(__dirname, "../../logs", "requests.log");

// Ensure the logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

const logger = (req, res, next) => {
  const logEntry = {
    id: req.user?.id || "Anonymous", // Extract ID from JWT if available
    route: req.originalUrl, // Route accessed
    method: req.method, // HTTP method
    query: req.query, // Query parameters
    body: req.method === "POST" ? req.body : undefined, // Body for POST requests
    timestamp: new Date().toISOString(), // Timestamp of the request
  };

    // Save the log entry to the database

    const log = new Log({
    userId: logEntry.id,
    route: logEntry.route,
    method: logEntry.method,
    query: logEntry.query,
    body: logEntry.body,
    timestamp: logEntry.timestamp,
  });
  log.save()
    .then(() => {
      console.log("Log entry saved to database");
    })
    .catch((err) => {
      console.error("Error saving log entry to database:", err);
    });

  const logMessage = `${logEntry.timestamp} - ID: ${logEntry.id} - Route: ${
    logEntry.route
  } - Method: ${logEntry.method} - Query: ${JSON.stringify(
    logEntry.query
  )} - Body: ${JSON.stringify(logEntry.body)}\n`;

  // Append the log entry to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
};

module.exports = { logger };
