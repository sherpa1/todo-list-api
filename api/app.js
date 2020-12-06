'use strict';

const express = require('express');
const app = express();

const {local_port,host} = require("./config/env");

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');
const helmet = require('helmet')
//const compression = require('compression');
const { CustomException, errorHandler } = require('./middlewares/error_handler');
const expressSession = require("express-session");
const csrf = require('csurf');
const { check, validationResult } = require('express-validator');


app.use(cors());

app.set('trust proxy', 1);

app.use(helmet());

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.json());
app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(compression);


const index_routes = require("./routes/index_routes");
app.use("/",index_routes);

const todos_routes = require("./routes/todos_routes");
app.use("/todos",todos_routes);

const tags_routes = require("./routes/tags_routes");
app.use("/tags",tags_routes);

const users_routes = require("./routes/users_routes");
app.use("/users",users_routes);

const auth_routes = require("./routes/auth_routes");
app.use("/auth",auth_routes);


//middleware permettant de traiter les erreurs 404
const error_404 = require("./middlewares/error_404");
app.use(error_404);

//middleware permettant de gérer de façon homogène toutes les erreurs retournées par le serveur
const error_handler = require("./middlewares/error_handler");
app.use(error_handler);

app.listen(local_port, async () => {
    console.log(`Todo List API listening at ${host}:${local_port}`);
});

