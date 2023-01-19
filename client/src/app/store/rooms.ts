import { AppThunk, RootState } from './createStore';
import { RoomType, BookingType } from './../types/types';
import { createAction, createSlice } from '@reduxjs/toolkit';
import roomsService from '../services/rooms.service';

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    entities: [] as Array<RoomType>,
    filteredEntities: [] as Array<RoomType>,
    isLoading: true as boolean,
    error: null as string | null,
  },
  reducers: {
    roomsRequested: state => {
      state.isLoading = true;
    },
    roomsReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    filteredRoomsReceived: (state, action) => {
      state.filteredEntities = action.payload;
      state.isLoading = false;
    },
    roomsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    roomUpdated: (state, action) => {
      const roomIndex = state.entities.findIndex(room => room._id === action.payload._id);
      state.entities[roomIndex] = action.payload;
    },
  },
});

const { actions, reducer: roomsReducer } = roomsSlice;

const { roomsRequested, roomsReceived, roomsRequestFailed, roomUpdated, filteredRoomsReceived } = actions;

const addBookingRoomRequested = createAction('rooms/addBookingRoomRequested');
const addBookingRoomRequestedSuccess = createAction('rooms/addBookingRoomRequestedSuccess');
const addBookingRoomRequestedFailed = createAction('rooms/addBookingRoomRequestedFailed');

const removeBookingRoomRequested = createAction('rooms/removeBookingRoomRequested');
const removeBookingRoomRequestedSuccess = createAction('rooms/removeBookingRoomRequestedSuccess');
const removeBookingRoomRequestedFailed = createAction('rooms/removeBookingRoomRequestedFailed');

const roomUpdateRequested = createAction('rooms/roomUpdateRequested');
const roomUpdateRequestedFailed = createAction('rooms/roomUpdateRequestedFailed');

export const loadRoomsList = (): AppThunk => async dispatch => {
  dispatch(roomsRequested());
  try {
    const { content } = await roomsService.getAll();
    dispatch(roomsReceived(content || []));
  } catch (error) {
    dispatch(roomsRequestFailed(error.message));
  }
};

export const loadFilteredRoomsList =
  (queryParams?: any): AppThunk =>
  async dispatch => {
    dispatch(roomsRequested());
    try {
      const { content } = await roomsService.getAll(queryParams);
      dispatch(filteredRoomsReceived(content || []));
    } catch (error) {
      dispatch(roomsRequestFailed(error.message));
    }
  };

export const addBookingRoom =
  (payload: BookingType): AppThunk =>
  async dispatch => {
    dispatch(addBookingRoomRequested());
    try {
      roomsService.setBooking(payload);
      dispatch(addBookingRoomRequestedSuccess());
    } catch (error) {
      dispatch(addBookingRoomRequestedFailed());
    }
  };

export const removeBookingRoom =
  (payload: { roomId: string; _id: string }): AppThunk =>
  async dispatch => {
    dispatch(removeBookingRoomRequested());
    try {
      roomsService.deleteBooking(payload);
      dispatch(removeBookingRoomRequestedSuccess());
    } catch (error) {
      dispatch(removeBookingRoomRequestedFailed());
    }
  };

export const updateRoomData =
  (payload: RoomType): AppThunk =>
  async dispatch => {
    dispatch(roomUpdateRequested());
    try {
      const { content } = await roomsService.update(payload);
      dispatch(roomUpdated(content));
    } catch (error) {
      console.log(error);
      dispatch(roomUpdateRequestedFailed());
    }
  };

export const getRooms = () => (state: RootState) => state.rooms.entities;
export const getFilteredRooms = () => (state: RootState) => state.rooms.filteredEntities;
export const getRoomsLoadingStatus = () => (state: RootState) => state.rooms.isLoading;
export const getRoomById = (roomId: string) => (state: RootState) => {
  if (state.rooms.entities) {
    return state.rooms.entities.find(room => room._id === roomId);
  }
};

export const getRoomsByIds = (roomsIds: string[]) => (state: RootState) => {
  if (state.rooms.entities) {
    return state.rooms.entities.filter(room => (roomsIds.length > 0 ? roomsIds.includes(room._id || '') : false));
  }
  return [];
};

export default roomsReducer;


//Commentaires
//La fonction roomsSlice initialise le reducer "rooms" en lui definissant plusieurs paramètres principalement 
//entities et filteredEntities, eux meme définis comme des objets disposant du type room (paramètres/variables définis 
// la feuille de code types). Le reducer se décompose en 5 scénaris: roomsRequested, roomsReceived, filteredRoomsReceived, 
// roomsRequestFailed, roomUpdated; ces scénaris déterminent la façon dont les valeurs des paramètres vont etre 
//incrémenté. Chaque scénari prend pour entrée de fonction un paramètre du reducer (principalement un objet) et une variable
// "action" qui représente le payload. Succintement:
// - roomsReceived: l'array d'objet entities est incrémenté par le payload. Le contenu du payload est déterminé lors de l'appel
// du reducer et de son scenarii.
// - filteredRoomsReceived: meme chose que roomsReceived mais cette fois l'array d'objet filteredEntities est incrémenté
// - roomUpdated: Selectionne l'objet entitie issu de l'array entities compte tenu de l'id du payload puis incrémente
// l'objet entitie de l'array entities. Le payload va définir le contenu de la modification de l'objet entitie.
//Les variables roomsSlice et actions sont définis pour destructurer les paramètres et scénéris du reducers pour etre en mesure
// d'appeler ces paramètres et scénaris à l'extérieure de la feuille de code.
// Les methodes implémentées redux createAction permettent de définir un type d'objet(ex: rooms/addBookingRoomRequested)
//puis de retourner un un objet contenant cet objet et un payload dans le cas ou un payload est utilisé en paramètre de
//la variable (ex: addBookingRoomRequested) affectée à createAction.
//La fonction loadRoomsList est fonction de type AppThunk (doit respecter la forme AppThunk), fonction qui invoque une autre
//fonction prenant comme entrée une promesse de type "dispatch" permettant l'invocation de reducer. Cette dernière fonction
//invoque le reducer roomsRequested en prenant en entrée aucun payload(aucun argmument lors de l'appel du reducer).
//En effet, ce reducer permet d'activer la variable isLoading a "true" et ne nécessite aucun argument. Par la suite,
//une requete HTML est demandée au server à l'adresse http "rooms/" grace à la fonction roomsService, le paramètre "queryParams"
//va venir indiquer et préciser l'adresse surlaquelle (adresse devenant "rooms/queryParams") un objet va etre retourner.
//Ensuite, le reducer roomsReceived va etre utiliser en prenant pour paramètre de méthode de ce reducer l'objet qui a 
//été retournée précédemment tandis ce que le deuxième argument ([]) représente le payload ou l'action a réalisé.
//Les fonctions loadFilteredRoomsList, addBookingRoom, removeBookingRoom et updateRoomData ont des fonctionnements très similaire
// à celle décrite dans loadRoomsList, les principales différences étant
//  - l'usage de scenarii différent lors de l'appel du reducer (ex: filteredRoomsReceived ou roomsRequested),
//  - la présence ou l'absence de payload lors de l'invocation de la roomservice(ex roomsService.getAll(queryParams)), 
//  - le choix de la méthode utilisée lors de l'invocation de la roomservice (ex: getAll, setBooking ou deleteBooking), 
//  - l'usage de la fonctionnalité createAction spécifique dans certaines fonctions (ex: removeBookingRoomRequestedSuccess, addBookingRoomRequestedSuccess),
//  - l'usage de payload spécifique lors de l'appel de fonction Appthunk (ex: payload: { roomId: string; _id: string } ou
//    payload: BookingType).
// Les fonctions "get" (ex: getRooms, getFilteredRooms...) sont des fonctions qui invoquent la fonction RootState rappelant que
// cette fonction retourne le type de rootReducer lui meme étant une concaténation de tous les reducers. Sur ces différents types, la
// variable rooms (définit comme paramètre par rootReducer) puis la variable entites (définit comme paramètre par roomsSlice) vont etre
// accéder pour etre associer la valeur de ces variables à la fonction "get" concernée.
// 
