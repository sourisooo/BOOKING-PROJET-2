const express = require('express');

const router = express.Router({ mergeParams: true });

router.use('/auth', require('./auth.routes'));
router.use('/review', require('./review.routes'));
router.use('/booking', require('./booking.routes'));
router.use('/rooms', require('./room.routes'));
router.use('/like', require('./like.routes'));
router.use('/user', require('./user.routes'));

module.exports = router;

//Commentaires
//La fonction paramètre toutes les routes pour accéder au serveur.


//The express. Router() function is used to create a new router object. This function 
//is used when you want to create a new router object in your program to handle requests. 
//Multiple requests can be easily differentiated with the help of the Router() function in Express.
