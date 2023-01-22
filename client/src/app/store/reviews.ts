import { AppThunk, RootState } from './createStore';
import { ReviewType } from './../types/types';
import { createAction, createSlice } from '@reduxjs/toolkit';
import reviewsService from '../services/reviews.service';

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    entities: [] as Array<ReviewType>,
    isLoading: false as boolean,
    error: null as string | null,
  },
  reducers: {
    reviewsRequested: state => {
      state.isLoading = true;
    },
    reviewsReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    reviewsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    reviewCreated: (state, action) => {
      state.entities.push(action.payload);
    },
    reviewRemoved: (state, action) => {
      state.entities = state.entities.filter(review => review._id !== action.payload);
    },
    reviewUpdated: (state, action) => {
      const reviewIndex = state.entities.findIndex(review => review._id === action.payload._id);
      state.entities[reviewIndex] = action.payload;
    },
  },
});

const { actions, reducer: reviewsReducer } = reviewsSlice;

const { reviewsRequested, reviewsReceived, reviewsRequestFailed, reviewCreated, reviewRemoved, reviewUpdated } =
  actions;

const reviewCreateRequested = createAction('reviews/reviewCreateRequested');
const reviewCreateRequestedFailed = createAction('reviews/reviewCreateRequestedFailed');

const reviewRemoveRequested = createAction('reviews/reviewRemoveRequested');
const reviewRemoveRequestedFailed = createAction('reviews/reviewRemoveRequestedFailed');

const reviewUpdateRequested = createAction('reviews/reviewUpdateRequested');
const reviewUpdateRequestedFailed = createAction('reviews/reviewUpdateRequestedFailed');

export const loadReviewsList = (): AppThunk => async dispatch => {
  dispatch(reviewsRequested());
  try {
    const { content } = await reviewsService.getAll();
    dispatch(reviewsReceived(content || []));
  } catch (error) {
    reviewsRequestFailed(error);
  }
};

export const removeReview =
  (reviewId: string): AppThunk =>
  async dispatch => {
    dispatch(reviewRemoveRequested());
    try {
      const id = await reviewsService.remove(reviewId);
      dispatch(reviewRemoved(id));
    } catch (error) {
      dispatch(reviewRemoveRequestedFailed());
    }
  };

export const createReview =
  (payload: ReviewType): AppThunk =>
  async dispatch => {
    dispatch(reviewCreateRequested());
    try {
      const { content } = await reviewsService.create(payload);
      dispatch(reviewCreated(content));
    } catch (error) {
      dispatch(reviewCreateRequestedFailed());
    }
  };

export const updateReview =
  (payload: ReviewType): AppThunk =>
  async dispatch => {
    dispatch(reviewUpdateRequested());
    try {
      const { content } = await reviewsService.update(payload);
      dispatch(reviewUpdated(content));
    } catch (error) {
      console.log(error);
      dispatch(reviewUpdateRequestedFailed());
    }
  };

export const getReviewsByIds = (rewsIds: string[]) => (state: RootState) => {
  if (state.reviews.entities) {
    return state.reviews.entities.filter((review: ReviewType) => rewsIds.includes(review._id || ''));
  } else {
    return [];
  }
};

export const getReviewsByRoomId = (roomId: string) => (state: RootState) => {
  if (state.reviews.entities) {
    return state.reviews.entities.filter((review: ReviewType) => review.roomId === roomId);
  } else {
    return [];
  }
};

export const getReviews = () => (state: RootState) => state.reviews.entities;
export const getReviewsLoadingStatus = () => (state: RootState) => state.reviews.isLoading;

export default reviewsReducer;

//Commentaires
//Le reducer reviews est défini avec la fonctionnalité redux createSlice. Ce reducers est défini avec
//plusieurs variables et plusieurs scénariis. Ces scénariis et variables sont destructurés au sein
//des variables  reviewsSlice et action afin de que les variables de ces fonctions puissent etre utiliser 
//dans d'autres feuilles de code. Plusieurs fonctions createAction sont crées affin de retourner un objet
// et son payload. La différence avec les scénariss de reducer vient du fait que les scénaris modifient
//les variables du reducer tandis ce que createAction retourne un objet avec un paramètre étant le payload
// vient en entrée de fonction).
//Par la suite plusieurs fonctions sont définies en intégrant les fonctions et variables préablemenent
//définis ultérieurement ainsi que l'usage de la reviewsService, cette dernière réalisant les requetes
//auprès du serveur (POST, GET, UPDATE, PUT).
//Les fonctions GET sont définis en prenant pour entrée de la premiere fonction un array de string, un string,
//fonction invocant une autre fonction et prenant pour argument un objet de type RootState, et la mise en
//entrée de fonction de ce dernier objet permet d'utiliser les objets et paramètre de RootState, et de les 
//intégréer dans l'implémentation des fonctions GET. Ces fonctions GET retournent des objets au sein
//d'un array.
//
