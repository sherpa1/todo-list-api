const express = require('express');
const router = express.Router();

const {LOCAL_PORT,DIST_PORT,HOST} = require("../config/env");

const base_url = `${HOST}:${DIST_PORT}/`; 

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