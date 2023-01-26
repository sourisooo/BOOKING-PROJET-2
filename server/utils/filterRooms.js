const moment = require('moment');
const Booking = require('../models/Booking');

const msInOneDay = 86_000_000;

const filterRooms = async (items, filters) => {
  if (!items && items.length === 0) return;
  let filteredItems = items;
  filters.arrivalDate = +filters.arrivalDate || Date.now();
  filters.departureDate = +filters.departureDate || Date.now() + msInOneDay;

  const bookings = await Booking.find();
  const bookedRoomsIds = bookings
    .filter(
      booking =>
        moment(filters.arrivalDate).isBetween(booking.arrivalDate, booking.departureDate) ||
        moment(filters.departureDate).isBetween(booking.arrivalDate, booking.departureDate) ||
        moment(booking.arrivalDate).isBetween(filters.arrivalDate, filters.departureDate)
    )
    .map(booking => booking.roomId.toString());

  filteredItems = filteredItems.filter(room => !bookedRoomsIds.includes(room._id.toString()));

  if (filters.hasWifi) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasWifi') : false));
  }

  if (filters.hasConditioner) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasConditioner') : false));
  }

  if (filters.hasWorkSpace) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasWorkSpace') : false));
  }

  if (filters.canSmoke) {
    filteredItems = filteredItems.filter(room => room.canSmoke);
  }

  if (filters.canPets) {
    filteredItems = filteredItems.filter(room => room.canPets);
  }

  if (filters.canInvite) {
    filteredItems = filteredItems.filter(room => room.canInvite);
  }

  if (filters.hasWideCorridor) {
    filteredItems = filteredItems.filter(room => room.hasWideCorridor);
  }

  if (filters.hasDisabledAssistant) {
    filteredItems = filteredItems.filter(room => room.hasDisabledAssistant);
  }

  if (filters.price) {
    filteredItems = filteredItems.filter(room => room.price >= filters.price[0] && room.price <= filters.price[1]);
  }

  return filteredItems;
};

module.exports = {
  filterRooms,
};

//Commentaires
//La fonction asynchrone prend pour entrée deux objets non définis. Un recherche est réalisé sur tous les objets
//de l'arrau booking puis des filtres sont appliqués de tel manière à prendre en considération l'un des deux
//objet en entrée de fonction (filters). Le meme procédé est appliqué à l'autre objet en entrée de fonction
//asynchrone (items). La fonction retourne l'objet filteredItems représentant l'array d'objet items surlesquel a été
//appliquée des filtres.
