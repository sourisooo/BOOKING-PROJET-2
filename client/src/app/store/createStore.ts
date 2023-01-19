import roomsReducer from './rooms';
import usersReducer from './users';
import likesReducer from './likes';
import reviewsReducer from './reviews';
import bookingsReducer from './bookings';
import { Action, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const rootReducer = combineReducers({
  rooms: roomsReducer,
  users: usersReducer,
  likes: likesReducer,
  reviews: reviewsReducer,
  bookings: bookingsReducer,
});

export function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk = ThunkAction<Promise<any>, RootState, unknown, Action>;


//Commentaires
//Globalamemnt, cette feuille de code va concatener toutes les informations relatives
//aux reducers pour etre en mesure de paramétrer et de rendre les reducers opérationnels
// sur l'intégralité de l'application.

//La constante rootReducer rassemble tout les reducers en un seul reducer.
//La constante AppThunk est définis par un "ThunkAction" qui retourne une promesse, utilise
//le state type de RootState, lui meme retournant le type de rootstate et determine le type
//d'action qui peuvent etre dispatcher cad de type "Action", type implémenté par Redux.

// export type ThunkAction<
// R, // Return type of the thunk function
// S, // state type used by getState
// E, // any "extra argument" injected into the thunk
// A extends Action // known types of actions that can be dispatched
// >
