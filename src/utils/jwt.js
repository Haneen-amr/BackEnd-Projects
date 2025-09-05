// utils/jwt.js
const { expressjwt: jwt } = require("express-jwt");
const Token = require("../models/TokenModel");

function authJwt() {
  const secret = process.env.secret;

  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [      
      { url: /\/api\/v1\/users\/login/, methods: ["POST"] },
      { url: /\/api\/v1\/users\/register/, methods: ["POST"] },
      { url: /\/api-docs.*/, methods: ["GET"] }
    ]
  });
}

async function isRevoked(req, token) {
  const currentToken = req.headers.authorization?.split(" ")[1];
  if (!currentToken) 
    return true; // no token -> block

  const savedToken = await Token.findOne({ token: currentToken, status: "revoked" });
  if (savedToken && savedToken.status === "revoked") {
    console.log("Blocked revoked token:", currentToken);
    return true;
  }

  return false; // token is valid
}

module.exports = authJwt;
