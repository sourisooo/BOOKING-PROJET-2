const express = require('express');
const Like = require('../models/Like');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const { orderBy, equalTo } = req.query;
    const likes = await Like.find({ [orderBy]: equalTo });
    res.status(200).send(likes);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newLike = await Like.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).send(newLike);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.delete('/:likeId', auth, async (req, res) => {
  try {
    const { likeId } = req.params;
    const removedLike = await Like.findById(likeId);

    if (removedLike.userId.toString() === req.user._id) {
      await removedLike.remove();
      return res.send(null);
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
//Le router gère les requetes à '/' concernant l'objet de like de type schema.
//La requete GET est réalisé en destructurant la requete (entrée de la fonction asynchrone), une recherche est réalisé
//dans l'array objet like appartenant à type schema (fonctionnalité de Mongose permettant
//d'interagir avec la bdd Mongodb). Le résultat de la recherche est envoyé au client.
//La requete POST est réalisée en créant un nouvel objet "Like" de type Schema.
//L'initialisation de la création est précisée grace à la requete en entrée de fonction asynchrone,
//puis la réponse est envoyé au client en envoyant l'objet nouvellet crée.
//La requete DELETE, destructure l'objet requete issu de l'entrée de fonction asynchrone, cette 
//destructuration est faite sans connataire et définir les variables/paramètres: il permet
//d'accéder aux paramètres/variables sans en connaitre le nom; cette spécifique destructuration est rendu possbile
//grance à la méthode params appliqué à la requete.
//Une recherche est réalisée dans l'array/liste de l'objet like de type schema.
//L'objet recherché est supprimé de l'array/liste d'objet avec la méthode remove implémentée Mongooose.
//Ensuite, la réponse est envoyé au client, envoyant une réponse null.
//