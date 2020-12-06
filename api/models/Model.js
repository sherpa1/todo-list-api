const DBClient = require("../utils/DB/DBClient");

class Model{

    static schema;

    static async create_schema(){
        try {
            const result = await DBClient.query(Model.schema);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }
    
    

}

module.export = Model;