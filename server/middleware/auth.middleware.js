const User = require('../models/User');
const tokenService = require('../services/token.service');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const data = tokenService.validateAccess(token);
    const currentUserData = await User.findById(data);

    req.user = data;
    req.userRole = currentUserData.role;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

//Commentaires
//La fonction asynchrone prend pour entrée une requete, un résultat, et un troisième objet de type non défini.
//What is Authorization header token?The HTTP Authorization request header can be used to provide credentials 
//that authenticate a user agent with a server, allowing access to a protected resource. The Authorization header 
//is usually, but not always, sent after the user agent first attempts to request a protected resource without credentials.
//Un controle du toker est réalisé pour vérifié sa présence dans la requete. Une requete get est réalisé dans l'array
//de token en utilisant tokenservice puis le user est recherché dans l'array User appartenant au schema User en prenant pour 
//paramètre de méthode le retour du GET issu de tokenservice. Les paramètres de la requetes sont redéfinis avec les nouvelles
//variables précédentes.