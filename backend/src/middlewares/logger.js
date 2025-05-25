const fs = require("fs");
const path = require("path");

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

  const logMessage = `${logEntry.timestamp} - ID: ${logEntry.id} - Route: ${logEntry.route} - Method: ${logEntry.method} - Query: ${JSON.stringify(
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

module.exports = logger;