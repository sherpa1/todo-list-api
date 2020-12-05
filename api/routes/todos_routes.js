const express = require('express');
const router = express.Router();

const {local_port,dist_port,host} = require("../config/env");

const base_url = `${host}:${dist_port}/todos`; 

router.get('/', async (req, res, next) => {
    res.status(200).location(req.path).json(
        { 
            total_items:todos.length,
            total_pages:1,
            page:1,
            page_size:todos.length,
            type:"todos",
            links:[
                {
                    rel:"self", 
                    href:base_url,
                    type:"GET"
                }
            ],
            data: todos 
        }
    );
});

router.get('/:id', async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing todo id" });

    const the_todo = todos.find((todo) =>
        (todo.id === Number(req.params.id)));

    if(the_todo==undefined)
    return res.status(404).location(req.path).json({ message: "Not Found" });

    res.status(200).location(req.path).json(
        {
            data:the_todo,
            type:"todos",
            links:[
                {
                    rel:"self", 
                    href:`${base_url}/${req.params.id}`,
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

module.exports = router;