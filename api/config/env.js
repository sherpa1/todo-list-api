const local_port = process.env.LOCAL_PORT || 3000;
const dist_port = process.env.DIST_PORT || 3000;
const host = process.env.HOST || "http://localhost";

module.exports = {local_port,dist_port,host};