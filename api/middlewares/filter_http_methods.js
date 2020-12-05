//permet de filtrer les méthodes HTTP autorisées par l'API
//const allowedMethods = ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'];
const allowedMethods = ['GET'];

const filter_http_methods = async (req, res, next) => {

    if (!allowedMethods.includes(req.method))
        return res.status(405).location(req.path).json({ message: 'Method Not Allowed' });
    else next();
};

module.exports = filter_http_methods;