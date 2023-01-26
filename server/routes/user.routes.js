const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.patch('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id) {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      res.send(updatedUser);
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

module.exports = router;

//Commentaires
//La page de code gère toutes les requetes réalisées au server prenant racine à '/' et '/:userId',
//concernant l'array d'objet user.
//La requete GET prend pour option une fonction asynchrone prenant pour entrée une requete et un reponse.
//Une recherche est faite sur touts les objets de l'array user, puis une réponse est envoyée au client
//en retournant l'intégralité de l'array user.
//La requete PATCHpour option une fonction asynchrone prenant pour entrée une requete et un reponse. L'objet
//requete est destructuré à travers la méthode params pour accéder aux paramètres et variables.
//Une recherche est réalisé sur l'array user, et les données sont modifiées sur l'objet trouvé par la
//recherche, les nouvelles données étant insérées dans le corps de la méthode findByIdAndUpdate.
//Une réponse est envoyée au client en envoyant l'objet précédemment trouvé et modifié.
