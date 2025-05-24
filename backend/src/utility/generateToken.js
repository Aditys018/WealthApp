const jwt = require("jsonwebtoken");

const generateTokens = (userId, name, permissions) => {
  console.log("Generating tokens for user:", { userId, name, permissions });
  const accessToken = jwt.sign(
    { id: userId, name, permissions },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "30m" }
  );

  console.log("Access token generated:", accessToken);

  const refreshToken = jwt.sign(
    { id: userId, name, permissions },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  console.log("Refresh token generated:", refreshToken);

  return { accessToken, refreshToken };
};

const generateAccessTokenFromRefresh = (refreshToken) => {
  const { id, name, permissions } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  return jwt.sign(
    { id, name, permissions },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: "3m" }
  );
};

module.exports = {
  generateTokens,
  generateAccessTokenFromRefresh,
};
