const express = require('express');
const router = express.Router();

const { LOCAL_PORT, DIST_PORT, HOST } = require("../config/env");
const DBClient = require('../utils/DB/DBClient');

const validator = require("validator");
const bcrypt = require("bcryptjs");
const { isAuthorized } = require('../middlewares/Token');
const saltRounds = 10;


let all_items, one_item;

const table = 'users';
const base_url = `${HOST}:${DIST_PORT}/${table}`;

router.post('/', async (req, res, next) => {

    if (req.body.password === undefined || req.body.email === undefined || req.body.firstname === undefined || req.body.lastname === undefined)
        return res.status(400).json({ message: "missing data" });

    if (validator.isEmpty(req.body.password))
        return res.status(400).json({ message: "missing password" });

    if (validator.isEmpty(req.body.firstname))
        return res.status(400).json({ message: "missing firstname" });

    if (validator.isEmpty(req.body.lastname))
        return res.status(400).json({ message: "missing lastname" });

    if (!validator.isEmail(req.body.email))
        return res.status(400).json({ message: "invalid mail address" });

    const {email, password, firstname,lastname} = req.body;

    let salt, hash;

    try {
        salt = await bcrypt.genSalt(saltRounds);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error, details:"error with salt" });
    }

    try {
        hash = await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error, details:"error with hash" });
    }
    
    
    try {
        
        const result = await DBClient.query(`INSERT INTO ${table} (email, password, firstname, lastname, created_at) VALUES ('${email}', '${hash}', '${firstname}', '${lastname}', NOW())`);
        
        return res.status(201).location(`${base_url}${req.path}`).json({
            href: `${base_url}${req.path}`,
            message: "User created",
            user: result.dataValues
        });
        
    } catch (error) {

        console.error(error);
        
        //si email déjà utilisé en bdd
        if (error == "SequelizeUniqueConstraintError: Validation error")
        return res.status(500).location(`${base_url}${req.path}`).json({ message: `User with email address "${req.body.email}" already exists` });
        else
        return res.status(500).location(`${base_url}${req.path}`).json({ message: error.message, });
    }


});

//GET ALL USERS
router.get('/', isAuthorized, async (req, res, next) => {

    try {
        all_items = await DBClient.all(`SELECT * FROM ${table}`);
    } catch (error) {
        throw new Error(error);
    }

    res.status(200).location(req.path).json(
        {
            total_items: all_items.length,
            total_pages: 1,
            page: 1,
            page_size: all_items.length,
            type: table,
            links: [
                {
                    rel: "self",
                    href: `${base_url}${req.path}`,
                    type: "GET"
                }
            ],
            data: all_items
        }
    );
});

//GET USER BY ID
router.get('/:id', isAuthorized, async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });

    let tods, tags = [];

    try {
        one_item = await DBClient.one(`SELECT * FROM ${table} WHERE id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if (one_item == undefined)
        return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        tags = await DBClient.all(`SELECT * FROM tags WHERE user_id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.tags = tags;

    try {
        todos = await DBClient.all(`SELECT * FROM todos WHERE user_id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.todos = todos;

    res.status(200).location(req.path).json(
        {
            data: one_item,
            type: table,
            links: [
                {
                    rel: "self",
                    href: `${base_url}${req.path}`,
                    type: "GET"
                },
                {
                    rel: "list",
                    href: `${base_url}`,
                    type: "GET"
                }
            ],
        }
    );
});

//GET USER BY ID AND TODOS
router.get('/:id/todos', isAuthorized, async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });

    let todos;

    try {
        one_item = await DBClient.one(`SELECT * FROM users WHERE id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if (one_item == undefined)
        return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        todos = await DBClient.all(`SELECT * FROM todos WHERE user_id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.todos = todos;

    res.status(200).location(req.path).json(
        {
            data: one_item,
            type: "users",
            links: [
                {
                    rel: "self",
                    href: `${base_url}${req.path}`,
                    type: "GET"
                },
                {
                    rel: "list",
                    href: `${base_url}`,
                    type: "GET"
                }
            ],
        }
    );
});

//GET USER BY ID AND TAGS
router.get('/:id/tags', isAuthorized, async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });

    let tags;

    try {
        one_item = await DBClient.one(`SELECT * FROM users WHERE id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if (one_item == undefined)
        return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        tags = await DBClient.all(`SELECT * FROM tags WHERE user_id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.tags = tags;

    res.status(200).location(req.path).json(
        {
            data: one_item,
            type: "users",
            links: [
                {
                    rel: "self",
                    href: `${base_url}${req.path}`,
                    type: "GET"
                },
                {
                    rel: "list",
                    href: `${base_url}`,
                    type: "GET"
                }
            ],
        }
    );
});


// router.use((req, res, next)=> {

//     const allowed_http_verbs = [];

//     router.stack.forEach(route => {

//         let verb;

//         try {

//             if (route.route != undefined) {

//                 verb = route.route.stack[0].method;

//                 if (!allowed_http_verbs.includes(verb)) allowed_http_verbs.push(verb);
//             }

//         } catch (error) {
//             console.error(error);
//         }
//     })

//     res.append('Allow', allowed_http_verbs.toString());
//     return res.status(405).json({ message: "Method Not Allowed" });
// });

module.exports = router;