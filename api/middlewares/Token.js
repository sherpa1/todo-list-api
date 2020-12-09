const fs = require("fs");
const jwt = require('jsonwebtoken');
const validator = require("validator");
const {JWT_KEY} = require("../config/env");

function isAuthorized(req, res, next) {

    if (typeof req.headers.authorization !== "undefined") {

        const token = req.headers.authorization.split(' ')[1];//Bearer Authorization

        if (!validator.isJWT(token)) return res.status(401).json({ code: 401, error: "Not Authorized", error_description: "Token is not valid" });

        try {
            
        } catch (error) {
            
        }

        jwt.verify(token, JWT_KEY, { algorithm: "HS256" }, (err) => {

            if (err) {
                if (err.message === "jwt expired") return res.status(498).json({ code: 498, error: "Not Authorized", error_description: "Expired Token" })

                return res.status(401).json({ code: 401, error: "Not Authorized", error_description: err.message });
            }

            return next();

        });

    } else {
        return res.status(400).json({ code: 401, error: "Not Authorized", error_description: "Missing Credentials" });
    }
}

function decodePayload (token){
    if(token !== null || token !== undefined){
     const base64String = token.split('.')[1];
     const decodedValue = JSON.parse(Buffer.from(base64String,'base64').toString('ascii'));
     return decodedValue;
    }
    return null;
}

module.exports = {isAuthorized,decodePayload};