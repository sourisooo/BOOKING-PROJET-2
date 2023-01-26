const express = require('express');
const { checkCanBooking } = require('../utils/checkCanBooking');
const Booking = require('../models/Booking');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const { orderBy, equalTo } = req.query;
    const bookings = await Booking.find({ [orderBy]: equalTo });
    res.status(200).send(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const canBooking = await checkCanBooking(req.body);
    if (canBooking) {
      const newBooking = await Booking.create({
        ...req.body,
        userId: req.user._id,
        expires_at: req.body.departureDate - req.body.arrivalDate,
      });

      res.status(201).send(newBooking);
    } else {
      res.status(400).send({
        error: {
          message: 'BOOKING_EXIST',
          code: 400,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.delete('/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const removedBooking = await Booking.findById(bookingId);
    const isAdmin = req.userRole === 'admin';
    const currentUser = removedBooking.userId.toString() === req.user._id;

    if (currentUser || isAdmin) {
      await removedBooking.remove();
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
//La feuille de code définit tous les requetes gérér par le serveur relatif à la réservation.
//Le router réalise une requete GET à l'adresse "/" en utilisant une fonction asynchrone et en prenant pour 
//entrée de fonction une requete et une réponse. Une recherche est faite parmis l'array d'objet du schema
//booking, puis le résultat de la recherche est retournée au client.
//Le router réalise une requete POST à l'adresse "/"en utilisant une fonction asynchrone et en prenant pour 
//entrée de fonction une requete et une réponse. La fonction checkCanBooking est appelé pour veérifier les 
//disponibilités de la chambre pour un booking spécifique. Un nouvel objet booking est crée en utilisant
//une méthode du schema mongoose en prenant comme paramètres d'initialisation de l'objet la requete.
//Le résultat (ici objet nouvellemet crée) est envoyé en client.
//Le router réalise une requete DELETE à l'adresse '/:bookingId' en utilisant une fonction asynchrone et en prenant pour 
//entrée de fonction une requete et une réponse. 
// What are params used for? By using the params keyword, you can specify a method parameter that takes a variable number of arguments.
// The parameter type must be a single-dimensional array. No additional parameters are permitted after the params keyword in a method
// declaration, and only one params keyword is permitted in a method declaration.
//Une recherche est réalisée sur le schema booking en prenant comme paramètre de méthode la requete de la fonction asynchrone.
//L'objet issue de la recherche est ensuite supprimer de l'array appartenant au schema booking (methode remove) puis une
//une réponse est envoyée au client en envoyant un objet null.