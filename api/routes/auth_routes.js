const express = require('express');
const router = express.Router();

const { LOCAL_PORT, DIST_PORT, HOST } = require("../config/env");
const DBClient = require('../utils/DB/DBClient');

const validator = require("validator");

const jwt = require('jsonwebtoken');
const jwt_duration = 3;
const jwt_expiration = 3600 * jwt_duration;//convert hour in seconds

const {JWT_KEY} = require('../config/env');

const bcrypt = require('bcryptjs');

const table = 'auth';
const base_url = `${HOST}:${DIST_PORT}/${table}`;


router.post('/', async (req, res, next) => {
    if (!req.headers.authorization)
        return res.status(401).location(`${base_url}${req.path}`).json({ message: "Missing credentials", result: "Unauthorized" });

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    [email, password] = credentials.split(':');

    email = email.trim().toLowerCase();
    password = password.trim();

    if (!validator.isEmail(email)) return res.status(400).send.json({ message: "Email is required", result: "Unauthorized" });
    if (validator.isEmpty(password)) return res.status(400).json({ message: "Password is required", result: "Unauthorized" });

    const user = await DBClient.one(`SELECT * FROM users WHERE email='${email}'`);

    if (typeof user == "undefined") {
        return res.status(404).location(`${base_url}${req.path}`).json(
            {
                href: `${base_url}${req.path}`,
                message: `User with email "${email}" does not exist`,
                result: "Unauthorized"
            }
        );
    }

    const hash = user.password;

    let result;

    try {
        result = await bcrypt.compare(password, hash);
    } catch (error) {

        console.error(error);

        res.status(500).location(`${base_url}${req.path}`).json(
            {
                href: `${base_url}${req.path}`,
                message: error,
                result: "Unauthorized"
            }
        );

    }


    if (result === true) {

        let token;

        try {
            token = jwt.sign(
                {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    id: user.id
                }
                ,
                JWT_KEY,
                { algorithm: 'HS256', expiresIn: jwt_expiration }
            );

            res.status(200).location(`${base_url}${req.path}`).json({
                href: `${base_url}${req.path}`,
                message: `User with email "${email}" has been authorized`,
                result: "Authorized",
                token: token,
            });

        } catch (error) {

            return res.status(401).location(`${base_url}${req.path}`).json(
                {
                    href: `${base_url}${req.path}`,
                    message: "Bad Credentials",
                    result: "Unauthorized"
                }
            );

        }

    } else {

        return res.status(401).location(`${base_url}${req.path}`).json(
            {
                href: `${base_url}${req.path}`,
                message: "Bad Credentials",
                result: "Unauthorized"
            }
        );
    }

});

router.use((req, res, next) => {

    const allowed_http_verbs = [];

    router.stack.forEach(route => {

        let verb;

        try {

            if (route.route != undefined) {

                verb = route.route.stack[0].method;

                if (!allowed_http_verbs.includes(verb)) allowed_http_verbs.push(verb);
            }

        } catch (error) {
            console.error(error);
        }
    })

    res.append('Allow', allowed_http_verbs.toString());
    return res.status(405).json({ message: "Method Not Allowed" });
});

module.exports = router;