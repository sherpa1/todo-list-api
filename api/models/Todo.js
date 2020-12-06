const Model = require("../models/Model");

class Todo extends Model{

    static schema = `
        CREATE TABLE 'todos' (
            'id' int unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
            'title' varchar(256) NOT NULL,
            'content' mediumtext NOT NULL,
            'status' tinyint NOT NULL
        ) COLLATE 'utf8_general_ci';
    `;

}

module.exports = Todo;