const express = require('express');
const router = express.Router({ mergeParams: true });
const Room = require('../models/Room');
const auth = require('../middleware/auth.middleware');
const { filterRooms } = require('../utils/filterRooms');

router.get('/', async (req, res) => {
  const query = req.query;
  try {
    const rooms = await Room.find();
    if (Object.keys(query).length > 0) {
      const filteredRooms = await filterRooms(rooms, query);
      return res.status(200).send(filteredRooms);
    }

    res.status(200).send(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    res.send(room);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.post('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    const isBooked = room.bookings.some(booking => booking.toString() === req.body.bookings);

    if (isBooked) {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, { $pull: req.body }, { new: true });
      res.send(updatedRoom);
    } else {
      const updatedRoom = await Room.findByIdAndUpdate(roomId, { $push: req.body }, { new: true });
      res.send(updatedRoom);
    }
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

router.patch('/:roomId', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
    res.send(updatedRoom);
  } catch (error) {
    res.status(500).json({
      message: 'На сервере произошла ошибка. Попробуйте позже',
    });
  }
});

module.exports = router;

//Commenntaires
//La feuille de code gère toutes les demandes auprès du serveur sur les routes '/' et 
//'/:roomId' concernat l'array d'objet room.
//La requete GET associée à '/' est réalisée en définissant la racine d'une requete JS (methode query) appliqué à l'objet
//requete issus pris en entrée de fonction asynchrone. Une recherche est réalisée dans l'array d'objet
//room de type schema. La fonction filterRooms est appellé pour recherché la rooms respectant les paramètters
//rooms (représentant l'objet trouvé par la recherche) et query (représentant le paramètre d'entrée de fonction
//asynchrone sur lesquel est appliqué la méthode query). Une réponse est envoyé au client en envoyant, l'array d'objet
//trouvé par les recherches et filtres.
//La requete GER associée à '/:roomId' est réalisée en destructurant l'objet pris en entrée de fonction asynchrone, destructruation
//réalisée avec params. Une recherche est réalisé dans l'array rooms en utilisant l'objet pris en entrée de fonction asynchrone.
//La réponse est envooyée au client en envoyant, l'objet trouvé par la recherche.
//La requete POST est réalisée  en destructurant l'objet pris en entrée de fonction asynchrone, destructruation
//réalisée avec params. Une recherche est réalisé dans l'array rooms en utilisant l'objet pris en entrée de fonction asynchrone.
//Puis résulte le booking  spécifique à la requete.
//Puis une recherche est réalisé dans l'array d'objet room puis l'objet trouvé est modifié selon les paramètres de la méthode
//findByIdAndUpdate(). Puis la réponse envoyé au client est réalisée en envoyant l'objet précédemennt modifié.
//La requete PATCH est réalisée  en destructurant l'objet pris en entrée de fonction asynchrone, destructruation
//réalisée avec params. Une recherche est réalisée dans l'array d'objet room de type schema en tenant compte de la requete
// prise en entrée de fonction asynchrone puis la réponse est envoyée au client en envoyant l'objet précedemment modifiée.
 