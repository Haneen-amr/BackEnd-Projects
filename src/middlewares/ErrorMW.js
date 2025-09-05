module.exports = ((err, req, res, nxt) => {
    console.error("Error handler caught:", err);
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ success: false, message: "The user is not authorized" })
    }

    if (err.name === 'ValidationError') {
        return res.status(401).json({ success: false, message: err.message })
    }

    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});