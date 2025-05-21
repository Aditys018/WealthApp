import jwt from "jsonwebtoken";

/**
 * Middleware to check if the user has the required role
 * @param {string[]} allowedRoles Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET
      );

      const hasRole = decoded.permissions.some((role) =>
        allowedRoles.includes(role)
      );
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      // append the decoded token to the request object
      // req.body.decoded = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
