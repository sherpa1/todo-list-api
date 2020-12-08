const express = require('express');
const router = express.Router();

const {local_port,dist_port,host} = require("../config/env");

const base_url = `${host}:${dist_port}/`; 

router.get('/', async (req, res, next) => {
    res.status(200).location(req.path).json(
        { 
            links:[
                {
                    rel:"self", 
                    href:base_url,
                    type:"GET"
                },
                {
                    rel:"tags",
                    href:base_url+'/tags',
                    type:"GET"
                },
                {
                    rel:"todos",
                    href:base_url+'/todos',
                    type:"GET"
                },
                {
                    rel:"users",
                    href:base_url+'/users',
                    type:"GET"
                },
            ],
        }
    );
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