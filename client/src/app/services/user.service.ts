import { UserType } from '../types/types';
import httpService from './http.service';
import localStorageService from './localStorage.service';

const userEndpoint = 'user/';

const userService = {
  getAll: async () => {
    const { data } = await httpService.get(userEndpoint);
    return data;
  },
  create: async (payload: UserType) => {
    const { data } = await httpService.put(userEndpoint + payload._id, payload);
    return data;
  },
  getById: async (id: string) => {
    const { data } = await httpService.get(userEndpoint + id);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await httpService.get(userEndpoint + localStorageService.getUserId());
    return data;
  },
  updateUserData: async (payload: UserType) => {
    const { data } = await httpService.patch(userEndpoint + localStorageService.getUserId(), payload);
    return data;
  },
};

export default userService;

//Commentaires
//La feuille de code gère les requetes HTML faite vers le serveur. Ces requetes concernent les requetes réalisées
//vers "user/" et tiennent compte de toutes sorte de demande: get, post, put et patch (voir ci-dessous); Certaines informations sont puisées
//dans le localStorageService pour réaliser les requetes.
//"PUT is a technique of altering resources when the client transmits data that revamps the whole resource.
// PATCH is a technique for transforming the resources when the client transmits partial data that will be updated 
// without changing the whole data."