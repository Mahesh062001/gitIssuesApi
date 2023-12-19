function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  if (err.name === "AuthenticationError") {
    res.status(401).json({ error: "Authentication required" });
  } else if (err.name === "NotFound") {
    res.status(404).json({ error: "Not found" });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = errorHandler;
