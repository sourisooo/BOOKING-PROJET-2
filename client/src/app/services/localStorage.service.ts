const TOKEN_KEY = 'jwt-token';
const REFRESH_KEY = 'jwt-refresh-token';
const EXPIRES_KEY = 'jwt-expires';
const USER_ID_KEY = 'user-local-id';
const FAVORITES_ROOM_KEY = 'favorites-room';

type SetTokensProps = {
  expiresIn: number;
  accessToken: string;
  userId: string;
  refreshToken: string;
};

export function setTokens({ expiresIn = 3600, accessToken, userId, refreshToken }: SetTokensProps) {
  const expiresDate = new Date().getTime() + expiresIn * 1000;

  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(EXPIRES_KEY, expiresDate.toString());
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getTokenExpiresDate() {
  return localStorage.getItem(EXPIRES_KEY);
}

export function getUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

export function getFavoritesRoom() {
  return localStorage.getItem(FAVORITES_ROOM_KEY);
}

export function toggleFavoriteRoom(roomId: string) {
  let favoritesRoomList = JSON.parse(getFavoritesRoom()!) || [];
  if (!favoritesRoomList.some((id: string) => id === roomId)) {
    favoritesRoomList.push(roomId);
  } else {
    favoritesRoomList = favoritesRoomList.filter((id: string) => id !== roomId);
  }
  localStorage.setItem(FAVORITES_ROOM_KEY, JSON.stringify(favoritesRoomList));
}

export function removeAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

const localStorageService = {
  setTokens,
  getAccessToken,
  getRefreshToken,
  getTokenExpiresDate,
  getUserId,
  removeAuthData,
  toggleFavoriteRoom,
  getFavoritesRoom,
};

export default localStorageService;


//Commentaire
//Les fonctions permettent de sauvegarder ou charger en local diverses données.
//"Many browser extensions store their data in the browser's so-called Local Storage, which 
//is nothing else than a storage location managed by the web browser. And as the same suggests, all is saved
// locally on the machine where the browser is installed. Local storage is not in the cloud."
//Toutes ses données sont ensuite concatenés dans la constante localStorageService pour pouvoir
//etre utiliser dans les autres feuilles de code.
//Concernant la fonction toggleFavoriteRoom, elle prend pour entrée un string (roomId), prend la liste
// ou array des favoris avec la fonction getFavoritesRoom, compare si le string roomId est présent dans
//l'array sinon l'ajoute dans l'array. L'objet ajouté est ensuite sauvegardé sur le localstorage:
//l'ancienne valeur FAVORITES_ROOM_KEY est remplacée par la nouvelle valeur favoritesRoomList.
