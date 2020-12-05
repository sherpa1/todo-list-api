const express = require('express');
const router = express.Router();

const {local_port,dist_port,host} = require("../config/env");

const base_url = `${host}:${dist_port}/users`; 

router.get('/', async (req, res, next) => {
    res.status(200).location(req.path).json(
        { 
            total_items:users.length,
            total_pages:1,
            page:1,
            page_size:users.length,
            type:"users",
            links:[
                {
                    rel:"self", 
                    href:base_url,
                    type:"GET"
                }
            ],
            data: users 
        }
    );
});

router.get('/:id', async (req, res, next) => {

    if (!req.params.id || req.params.id == undefined || req.params.id == 0) return res.status(401).location(req.path).json({ message: "Missing user id" });

    const the_user = users.find((user) =>
        (user.id === Number(req.params.id)));

    if(the_user==undefined)
    return res.status(404).location(req.path).json({ message: "Not Found" });

    res.status(200).location(req.path).json(
        {
            data:the_user,
            type:"users",
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