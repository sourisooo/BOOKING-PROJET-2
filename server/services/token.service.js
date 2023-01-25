const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const config = require('config');

class TokenService {
  generate(payload) {
    const accessToken = jwt.sign(payload, config.get('ACCESS_SECRET'), {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign(payload, config.get('REFRESH_SECRET'));

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    };
  }

  async save(userId, refreshToken) {
    const data = await Token.findOne({ user: userId });
    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  validateRefresh(refreshToken) {
    try {
      return jwt.verify(refreshToken, config.get('REFRESH_SECRET'));
    } catch (error) {
      return null;
    }
  }

  validateAccess(accessToken) {
    try {
      return jwt.verify(accessToken, config.get('ACCESS_SECRET'));
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      return await Token.findOne({ refreshToken });
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();

//Commentaires
//La classe TokenService contient plusieurs fonctions qui vont permettre d'intérargir avec les jetons:
//la fonction generate utilise la méthode sign pour  générer un nouveau jeton. 
//L'objet token est un schema moongoose constitué de deux objets users et refreshToken.
//La methode asynchrone prenant pour entrée deux objets non typés recherche un token parmi
//une liste d'objet token, le sauvegarde si il le trouve sinon en crée un nouveau.
//Les fonctions validate représentent des fonctions GET cherchant un objet specfique dans la 
//liste de token.
//