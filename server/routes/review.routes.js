const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth.middleware');
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const { orderBy, equalTo } = req.query;
    const reviews = await Review.find({ [orderBy]: equalTo });
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newReview = await Review.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).send(newReview);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.patch('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
    res.send(updatedReview);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const removedReview = await Review.findById(reviewId);
    if (removedReview.userId.toString() === req.user._id || req.userRole === 'admin') {
      await removedReview.remove();
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
//La feuille de code gère toutes les requetes réalisées sur ('/') et (/:reviewId).
//La demande GET est réalisé en destructurant la requete pour permettre l'usage d'une des variables
//ou paramètres de la requete représentant l'objet en entrée de fonction asynchone, une recherche est réalisée
//,en fonction de la requete passée en entrée de fonction asynchone, sur l'array d'objet review de type
//schema. La réponse est envoyée au client en envoyant l'objet de la recherche.
//La demande POST est réalisé en créant un nouvel objet dans l'array Review. Une réponse est envoyée
//au client en enovyant l'objet nouvellement cré.
//La demande PATCH est réalisé en destrurant la requete en utilisant params, rappelant que params
//permet une destrucration d'un objet sans en connaitres les variables/paramètres.
//Unre recherche est effectuée dans l'array review puis modifie les variables de cet objet en utilisant
//la méthode implémentée par Mongoose apellée findByIdAndUpdate. Les nouvelles valeurs à attribuer sont 
//spécifié dans le corps de la méthode(). La réponse au client en envoyée en envoyant l'objet nouvellement
//modifiée. 
//La demande DELETE est réalisé en destrurant la requete en utilisant params, rappelant que params
//permet une destrucration d'un objet sans en connaitres les variables/paramètres.
//Une recherche est réalisée dans l'array d'objet Review de type Schema. Puis, l'objet trouvé
//dans l'array est supprimé de l'array Review.
//Une réponse est envoyé au client en envoyant une réponse nulle (null).
