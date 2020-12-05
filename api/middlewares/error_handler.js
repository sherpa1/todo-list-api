//permet de gérer de façon homogène les messages d'erreur retournés par l'API
const error_handler = async (err, req, res, next) => {
  
    return res.status(err).location(req.path).json(err);

};

module.exports = error_handler;