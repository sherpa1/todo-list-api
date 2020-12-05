//permet de gérer les erreurs 404
//https://expressjs.com/fr/starter/faq.html
const error_404 = async (req, res, next) => {

    return res.status(404).location(req.path).json({message:"Not Found"});

};

module.exports = error_404;