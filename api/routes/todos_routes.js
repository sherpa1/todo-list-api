const express = require('express');
const router = express.Router();

const {local_port,dist_port,host} = require("../config/env");
const DBClient = require('../utils/DB/DBClient');


let all_items, one_item;

const table = 'todos';
const base_url = `${host}:${dist_port}/${table}`; 

//GET ALL TODOS
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

    let tags = [];

    try {
        one_item = await DBClient.one(`SELECT * FROM ${table} WHERE id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    if(one_item==undefined)
    return res.status(404).location(req.path).json({ message: "Not Found" });

    try {
        tags = await DBClient.all(`SELECT * FROM tags, tags_todos WHERE tags_todos.todo_id=${req.params.id} AND tags.id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.tags = tags;

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
        tags = await DBClient.all(`SELECT * FROM tags, tags_todos WHERE tags_todos.todo_id=${req.params.id} AND tags.id=${req.params.id}`);
    } catch (error) {
        throw new Error(error);
    }

    one_item.tags = tags;

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
    
//GET ALL TODOS BY USER ID
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

module.exports = router;