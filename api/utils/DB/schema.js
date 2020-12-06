const Todo = require("../../models/Todo");
const DBClient = require("../DB/DBClient");
const Todo = require("../../models/Todo");
const Tag = require("../../models/Tag");
const User = require("../../models/User");

const result = await DBClient.query(Todo.schema);

return result;