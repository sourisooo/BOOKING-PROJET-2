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
//La fonction asynchrone prend pour entr??e deux objets non d??finis. Un recherche est r??alis?? sur tous les objets
//de l'arrau booking puis des filtres sont appliqu??s de tel mani??re ?? prendre en consid??ration l'un des deux
//objet en entr??e de fonction (filters). Le meme proc??d?? est appliqu?? ?? l'autre objet en entr??e de fonction
//asynchrone (items). La fonction retourne l'objet filteredItems repr??sentant l'array d'objet items surlesquel a ??t??
//appliqu??e des filtres.
