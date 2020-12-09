const LOCAL_PORT = process.env.LOCAL_PORT || 3000;
const DIST_PORT = process.env.DIST_PORT || 3000;
const HOST = process.env.HOST || "http://localhost";
const JWT_KEY = process.env.JWT_KEY;

module.exports = { LOCAL_PORT, DIST_PORT, HOST, JWT_KEY };