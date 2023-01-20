import { BookingType } from '../types/types';
import httpService from './http.service';

const bookingEndPoint = 'booking/';

const bookingService = {
  getAll: async () => {
    const { data } = await httpService.get(bookingEndPoint);
    return data;
  },
  create: async (payload: BookingType) => {
    const { data } = await httpService.post(bookingEndPoint, payload);
    return data;
  },
  remove: async (id: string) => {
    await httpService.delete(bookingEndPoint + id);
    return id;
  },
  getById: async (id: string) => {
    const { data } = await httpService.get(bookingEndPoint + id);
    return data;
  },
  getUserBookings: async (userId: string) => {
    const { data } = await httpService.get(bookingEndPoint, {
      params: {
        orderBy: 'userId',
        equalTo: `${userId}`,
      },
    });
    return data;
  },
  getRoomBookings: async (roomId: string) => {
    const { data } = await httpService.get(bookingEndPoint, {
      params: {
        orderBy: 'roomId',
        equalTo: `${roomId}`,
      },
    });
    return data;
  },
};

export default bookingService;


//Commentaires
//Cettes page de code gère les requetes auprès du serveur concernant les requetes HTML "booking/";
//La fonction bookingService est constituée de plusieurs fonctions qui vont en charge les différentes
//requetes (GET, POST, DELETE). Toutes les spécificités sont pris en charges en argument de la méthode
//GET dans l'objet params.