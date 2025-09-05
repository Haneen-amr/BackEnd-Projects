function checkAdmin(req, res, nxt) {
  if (req.auth && req.auth.isAdmin) {
    return nxt();
  }
  return res.status(403).json({ success: false, message: "For Admins only" });
};

// Owners (their own account) or admins
function checkOwnerOrAdmin(req, res, nxt) {
  if (req.auth && (req.auth.isAdmin || req.auth.userId === req.params.id)) {
    return nxt();
  }
  return res.status(403).json({ success: false, message: "Not authorized User" });
};

// **Profile owner only (not admin)**
function checkAuth(req, res, next) {
    if (!req.auth) {
      return res.status(401).json({ success: false, message: "Unauthorized User!" });
    } 
    return next();
}

// **Any logged-in user but not admin (for placing orders)**
function checkNonAdminUser(req, res, next) {
  console.log("DEBUG in checkNonAdminUser, req.auth:", req.auth);

  if (!req.auth) {
    return res.status(401).json({ success: false, message: "Unauthorized: no token payload" });
  }

  if (req.auth.isAdmin) {
    return res.status(403).json({ success: false, message: "Admins cannot perform this action" });
  }

  if (req.body && req.body.userId && req.body.userId !== req.auth.userId) {
    return res.status(403).json({ success: false, message: "You cannot place orders on behalf of another user" });
  }

  next();
}


module.exports = {
  checkAdmin,
  checkOwnerOrAdmin,
  checkAuth,
  checkNonAdminUser
};
