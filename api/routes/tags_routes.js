const express = require('express');
const router = express.Router();

const {local_port,dist_port,host} = require("../config/env");
const DBClient = require('../utils/DB/DBClient');

const validator = require("validator");

let all_items, one_item;

const table = 'tags';
const base_url = `${host}:${dist_port}/${table}`; 

//toutes les requêtes nécessitent de disposer d'un token
const { isAuthorized, decodePayload } = require("../middlewares/BearerChecker");
router.use(isAuthorized);

//GET ALL TAGS
router.get('/', async (req, res, next) => {

    try {
        all_items = await DBClient.all(`SELECT * FROM ${table}`);
    } catch (error) {
        throw new Error(error);
    }

    res.status(200).location(req.path).json(
        { 
            total_items:all_items.length,
            total_pages:1,
            page:1,
            page_size:all_items.length,
            type:table,
            links:[
                {
                    rel:"self", 
                    href:`${base_url}${req.path}`,
                    type:"GET"
                }
            ],
            data: all_items 
        }
    );
});

//GET TODO BY ID
router.get('/:id', async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing todo id" });


    try {
        one_item = await DBClient.one(`SELECT * FROM ${table} WHERE id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if(one_item==undefined)
    return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        todos = await DBClient.all(`SELECT * FROM todos, tags_todos WHERE tags_todos.tag_id=${req.params.id} AND todos.id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.todos = todos;

    res.status(200).location(req.path).json(
        {
            data:one_item,
            type:table,
            links:[
                {
                    rel:"self", 
                    href:`${base_url}${req.path}`,
                    type:"GET"
                },
                {
                    rel:"list", 
                    href:`${base_url}`,
                    type:"GET"
                }
            ],
        }
    );
});


//GET TODO BY ID AND BY USER ID
router.get('/:id/user/:user_id', async (req, res, next) => {

    if (!req.params.user_id || req.params.user_id == undefined || req.params.user_id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });
    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing todo id" });

    try {
        one_item = await DBClient.one(`SELECT * FROM ${table} WHERE user_id=${req.params.user_id} AND id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if(one_item==undefined)
    return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        todos = await DBClient.all(`SELECT * FROM todos, tags_todos WHERE tags_todos.tag_id=${req.params.id} AND todos.id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.todos = todos;

    res.status(200).location(req.path).json(
        {
            data:one_item,
            type:table,
            links:[
                {
                    rel:"self", 
                    href:`${base_url}${req.path}`,
                    type:"GET"
                },
                {
                    rel:"list", 
                    href:`${base_url}/user/${req.params.user_id}`,
                    type:"GET"
                }
            ],
        }
        );
    });
    
//GET ALL TAGS BY USER ID
router.get('/user/:user_id', async (req, res, next) => {
    
    if (!req.params.user_id || req.params.user_id == undefined || req.params.user_id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });
    
    try {
        all_items = await DBClient.all(`SELECT * FROM ${table} WHERE user_id=${req.params.user_id}`);
    } catch (error) {
        throw new Error(error);
    }
    
    res.status(200).location(req.path).json(
        { 
            total_items:all_items.length,
            total_pages:1,
            page:1,
            page_size:all_items.length,
            type:table,
            links:[
                {
                    rel:"self", 
                    href:`${base_url}${req.path}`,
                    type:"GET"
                }
            ],
            data: all_items 
        }
    );
});

router.post("/",async(req,res,next)=>{
    if(validator.isEmpty(req.body.name))
    return res.status(400).json({ message: "missing name" });

    const token = req.headers.authorization;

    let payload = decodePayload(token);

    const {id} = payload;
    let {name} = req.body;

    try {
        const sql = `
        INSERT INTO ${table} 
        (name, user_id) 
        VALUES('${name}', ${id})`;

        await DBClient.query(sql)
        res.status(201).location(`${base_url}${req.path}`).json({message:"Tag created"});
    } catch (error) {
        res.status(500).location(`${base_url}${req.path}`).json({message:error});
    }

});


const allowed_http_verbs = [];

router.stack.forEach(route=>{
    try {
        const verb = route.route.stack[0].method;

        if (!allowed_http_verbs.includes(verb)) allowed_http_verbs.push(verb);

    } catch (error) {
        console.error(error);
    }
})

router.use(function(req, res, next) {
    res.append('Allow', allowed_http_verbs.toString());
    return res.status(405).json({message:"Method Not Allowed"});
});

module.exports = router;