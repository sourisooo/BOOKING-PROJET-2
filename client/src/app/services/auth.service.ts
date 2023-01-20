import { UserType, SignInDataType } from './../types/types';
import axios from 'axios';
import localStorageService from './localStorage.service';
import config from '../config.json';

const httpAuth = axios.create({
  baseURL: `${config.apiEndPoint}/auth/`,
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY,
  },
});

const authService = {
  signUp: async (payload: UserType) => {
    const { data } = await httpAuth.post(`signUp`, payload);
    return data;
  },
  signIn: async ({ email, password }: SignInDataType) => {
    const { data } = await httpAuth.post(`signInWithPassword`, {
      email,
      password,
      returnSecureToken: true,
    });
    return data;
  },
  refresh: async () => {
    const { data } = await httpAuth.post('token', {
      grant_type: 'refresh_token',
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;

//Commentaires
//La constante httpAuth est crée pour spécifée un paramétrage HTTP client: port 8080 et /api.
//La fonction authService gère plusieurs demandes de requete auprès du serveur, exclusivement
//POST concernant les objets signUp, signInWithPassword, token, ces derniers étant spécifiés
//directement dans le code actuel. Les demandes POST sont réalisés sur la constante httpAuth,
//cad le port 8080 et /api.