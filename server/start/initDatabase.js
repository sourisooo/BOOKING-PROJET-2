const roomsMockData = require('../mockData/rooms.json');

const Room = require('../models/Room');

module.exports = async () => {
  const rooms = await Room.find();
  if (rooms.length !== roomsMockData.length) {
    await createInitialEntity(Room, roomsMockData);
    console.log('rooms add mongoDB');
  }
};

async function createInitialEntity(Model, data) {
  await Model.collection.drop();
  return Promise.all(
    data.map(async item => {
      try {
        delete item._id;
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (error) {
        return error;
      }
    })
  );
}

//Commentaires
//La fonction createInitialEntity prend pour paramètre 2 objets non définis puis supprime la collection
//de la base de donnée, retourne tous les promess au sein d'un array, navigue au sein de chaque élément de
//l'array puis réalise une demande asynchrone prenant pour entrée de fonction un objet non typée, supprime
//l'id (paramètre) de l'objet, crée un nouvel objet modèle (par instanciation) en prenant comme paramètre l'objet itemn puis
//retourne cet objet issue de l'instanciation.

// Collection. drop() method is used to drop a collection from a database. It completely removes
// a collection from the database and does not leave any indexes associated with the dropped collections.
// The Save method saves a Recordset object to a file or a Stream object.