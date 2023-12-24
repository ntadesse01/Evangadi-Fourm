const { statusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(statusCodes.UNAUTHORIZED).json({ msg: "Authentication invalid" });
  }

  const token = authHeader.split(' ')[1];
//   console.log(authHeader);
//   console.log(token);

  try {
    // Your authentication logic goes here

    const { username, userid } = jwt.verify(token, 'secret');
    req.user = { username, userid };
    // Store the authenticated user data in the request object

    next(); // Call next() if authentication is successful
  } catch (error) {
    return res.status(statusCodes.UNAUTHORIZED).json({ msg: "Authentication invalid" });
    // Handle any errors that occur during authentication
  }
}

module.exports = authMiddleware;