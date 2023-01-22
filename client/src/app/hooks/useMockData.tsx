import { useEffect, useState } from 'react';
import httpService from '../services/http.service';
import { RoomType, UserType, ReviewType, LikeType } from '../types/types';

const rooms: Array<RoomType> = [];
const users: Array<UserType> = [];
const reviews: Array<ReviewType> = [];
const likes: Array<LikeType> = [];

const useMockData = () => {
  const statusMap = {
    idle: 'Not Started',
    pending: 'In Process',
    success: 'Ready',
    error: 'Error occurred',
  };
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState(statusMap.idle);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const summaryCount = [rooms, reviews, users, likes].reduce((acc, cur) => acc + cur.length, 0);

  const incrementCount = () => {
    setCount(prevState => prevState + 1);
  };

  const updateProgress = () => {
    if (count !== 0 && status === statusMap.idle) {
      setStatus(statusMap.pending);
    }
    const newProgress = Math.floor((count / summaryCount) * 100);
    if (progress < newProgress) {
      setProgress(() => newProgress);
    }
    if (newProgress === 100) {
      setStatus(statusMap.success);
    }
  };

  useEffect(() => {
    updateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  async function initialize() {
    try {
      for (const room of rooms) {
        await httpService.put('rooms/' + room._id, room);
        incrementCount();
      }
      for (const user of users) {
        await httpService.put('user/' + user._id, user);
        incrementCount();
      }
      for (const review of reviews) {
        await httpService.put('reviews/' + review._id, review);
        incrementCount();
      }
      for (const like of likes) {
        await httpService.put('likes/' + like._id, like);
        incrementCount();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        setStatus(statusMap.error);
      }
    }
  }

  return { error, initialize, progress, status };
};

export default useMockData;

//Commentaires
//La fonction constitue plusieurs arrays de différents types: rooms, users, reviews et likes.
//La fonction summaryCount réalise un comptage des plusieurs variables usant de useState.
//La fonction updateProgress realise plusieurs controle afin d'affecter les variables 
//useState en appelant leur foncction SET.
//UseEffect est utilisée de tel manière à ce que la fonction updateProgress soit
//lancée à chaque fois que la variable count utilisant useState est modifiée.
//La fonction initialize est asynchrone/une promesse. La fonction réalise des demandes
//de requetes PUT auprès du serveur relatifs à un id spécifique.
//La fonction useMockData return l'ensemble des fonctions spécifiés ci-dessus.