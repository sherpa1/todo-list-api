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

module.exports = router;