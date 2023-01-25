const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { generateUserData } = require('../utils/helpers');
const User = require('../models/User');
const router = express.Router({ mergeParams: true });
const tokenService = require('../services/token.service');

function isTokenInvalid(data, dbToken) {
  return !data || !dbToken || data._id !== dbToken?.user?.toString();
}

router.post('/signUp', [
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: {
            message: 'INVALID DATA',
            code: 400,
          },
        });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: {
            message: 'EMAIL_EXISTS',
            code: 400,
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        ...generateUserData(),
        ...req.body,
        role: 'user',
        password: hashedPassword,
      });

      const tokens = tokenService.generate({ _id: newUser._id });
      await tokenService.save(newUser._id, tokens.refreshToken);
      res.status(201).send({ ...tokens, userId: newUser._id });
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже',
      });
    }
  },
]);

router.post('/signInWithPassword', [
  check('email', 'Email некорректный').normalizeEmail().isEmail(),
  check('password', 'Пароль не может быть пустым').exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: {
            message: 'INVALID_DATA',
            code: 400,
          },
        });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).send({
          error: {
            message: 'EMAIL_NOT_FOUND',
            code: 400,
          },
        });
      }

      const isPasswordEqual = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordEqual) {
        return res.status(400).json({
          error: {
            message: 'INVALID_PASSWORD',
            code: 400,
          },
        });
      }

      const tokens = tokenService.generate({ _id: existingUser._id });
      await tokenService.save(existingUser._id, tokens.refreshToken);

      res.status(200).send({
        ...tokens,
        userId: existingUser._id,
      });
    } catch (error) {
      res.status(500).json({
        message: 'На сервере произошла ошибка. Попробуйте позже',
      });
    }
  },
]);

router.post('/token', async (req, res) => {
  try {
    const { refresh_token: refreshToken } = req.body;
    const data = tokenService.validateRefresh(refreshToken);
    const dbToken = await tokenService.findToken(refreshToken);

    if (isTokenInvalid(data, dbToken)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tokens = await tokenService.generate({
      _id: data._id,
    });

    await tokenService.save(data._id, tokens.refreshToken);

    res.status(200).send({ ...tokens, userId: data._id });
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

module.exports = router;


//Commentaires
//La fonction isTokenInvalid compare deux objets, retourne unn boolean.
//Express validator: Simply said, Express Validator is an Express middleware library that you can 
//incorporate in your apps for server-side data validation. Une demande POST est faite au router
//à l'adresse signUp et prend pour option/dependance les éléments suivants:
// Une variable identiant et un mot de passe en utilisant la méthode check permettant de créer
//un nouvel email, mdp.
// ValidationResult: Extracts the validation errors from a request and makes them available in a Result object.
//Une demande asynchrone est réalisée en prenant deux objet non définis en entrée (requete et reponse).
//La requete est destructuré en deux variables (email et password). Une recherche dans l'array de toute 
//la collection du schema user est réalisé et un message est retourné si cet user est retrouvé.
//bcrypt est une bibliothèque utilisée pour crypté des données. Un nouvel user est crée en utilisant
//les paramètres user et mdp précédemment crées. Ensuite, un token est crée en utilisant le user précédemment crée
//puis sauvegarder permettant l'incrementation de refreshToken de l'objet token à true.
//La réponse est envoyé au client en incluant le token et newUser._id de type user en spread(...) pour
//compléter la réponse dans le cas ou des éléments supplémentaires auraient été crée.
//Une demande PUT est réalisé au router  à l'adresse /signInWithPassword, email et password sont crées,
//puis une demande asynchrone prenant en entrée une requete et une répnose, rechercher dans l'array
//de user pour vérifier son existence, rechercher dans l'array des passwords pour vérifer son existence
//(pris en charge par bcryp),puis un tocken est généré en prenant pour entrée de fonction le user nouvellement
//créé puis la réponse est envoyé au client en lui envoyant le tocken ainsi que le user id en spread (...).
//Une demande POST est envoyé au router à l'adresse /token prenant pour entrée de fonction une requete
//et une réponse, la requete est destructurée puis diverse fonction tokenService sont utilisées (GET) sur
//les arrays jwt et le token puis générer un token en prenant pour entrée la requete passée en entrée de
//la fonctin asynchrone. Une réponse va etre envoyé au client en envoyant les tokens et userid en spread(...).