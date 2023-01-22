import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeReview, updateReview } from '../../../../store/reviews';
import { getRoomById, updateRoomData } from '../../../../store/rooms';
import { getCurrentUserData, getUserById } from '../../../../store/users';
import { ReviewType } from '../../../../types/types';
import formatDate from '../../../../utils/formatDate';
import Avatar from '../../../common/Avatar';
import Button from '../../../common/Button';
import { TextAreaField } from '../../../common/Fields';
import Loader from '../../../common/Loader';
import Rating from '../../../common/Rating';
import Tooltip from '../../../common/Tooltip';
import ReviewLikes from '../ReviewLikes';

type ReviewProps = {
  review: ReviewType;
};

const Review: React.FC<ReviewProps> = ({ review }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const currentRoomData = useSelector(getRoomById(review.roomId));
  const user = useSelector(getUserById(review.userId || ''));
  const currentUser = useSelector(getCurrentUserData());

  const displayReviewData = () => {
    if (review.created_at !== review.updated_at) {
      return `Редактирован: ${formatDate(review?.updated_at || '')}`;
    }
    return formatDate(review?.created_at || '');
  };

  const isAdmin = currentUser?.role === 'admin';
  const isAuthor = review.userId === currentUser?._id;
  const showDeleteBtn = isAdmin || isAuthor;

  const handleChangeReview = () => {
    setEditMode(false);
    const payload = { _id: review._id, rating: review.rating, roomId: review.roomId, content: review.content };
    dispatch(updateReview(payload));
  };

  const handleRemoveReview = () => {
    dispatch(removeReview(review._id || ''));
    const updateRoomPayload = {
      _id: currentRoomData?._id || 'not found',
      price: currentRoomData?.price || 0,
      roomNumber: currentRoomData?.roomNumber || 'not found',
      countReviews: Number(currentRoomData?.countReviews) - 1,
      rate: Number(currentRoomData?.rate) - review.rating,
    };
    dispatch(updateRoomData(updateRoomPayload));
  };

  useEffect(() => {
    setContent(review.content);
  }, [review]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  if (user) {
    return (
      <li className='reviews-list__item'>
        <div className='review'>
          <div className='review__avatar'>
            <div className='avatar'>
              <Avatar alt='пользователя' src={user.avatarPhoto || ''} className='avatar__img' />
            </div>
            <ReviewLikes reviewId={review._id || ''} />
          </div>
          <div className='review__content'>
            <div className='review__user-name'>
              {`${user.firstName} ${user.secondName}`}
              {isAuthor && (
                <div className='review__edit-btn'>
                  <Tooltip title='Редактировать'>
                    <IconButton onClick={() => setEditMode(true)}>
                      <EditIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              {showDeleteBtn && (
                <div className='review__delete-btn'>
                  <Tooltip title='Удалить отзыв'>
                    <IconButton onClick={handleRemoveReview}>
                      <ClearIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
              <div className='review__rating'>
                <Rating value={review.rating} readOnly />
              </div>
            </div>
            <p className='review__date'>{displayReviewData()}</p>
            {editMode ? (
              <>
                <TextAreaField value={content} onChange={handleChange} rows={3} />
                <Button variant='outlined' size='small' style={{ marginTop: '5px' }} onClick={handleChangeReview}>
                  Применить
                </Button>
              </>
            ) : (
              <p className='review__message'>{content}</p>
            )}
          </div>
        </div>
      </li>
    );
  }
  return <Loader />;
};

export default Review;

//Commentaires
//Review est une fonction qui accepte pour entrée un type ReviewProps. Au sein de la fonction, plusieurs fonctions
//sont définis en prenant utilisant les scénariss des reducers room et use à travers les fonctions GET de ses scénariis. 
//La fonction useSelector permet de récupérer l'objet stocké dans la fonction GET.
//La fonction handleRemoveReview utilise les scénariis des reducers rooms et reviews qui vont essentiellement réaliser une
//requette HTTP aurpès du serveur à travers la fonction reviewsService et dans un second temp modifier la valeur des paramètres
//à travers un scénariis du reducer reviews. Un UseEffet est spécifié pour incrémenter une variable implémentée UseState à chaque
//modification de l'objet review rappelant qu'il s'agit de la variable d'entrée de la fonction Review.
//La fonction handleChange est une fonction qui prend pour entrée une saisie de type HTMLInputElement et à chaque modification,
//modifie la valeur de content à travers la méthode SET de la fonctionnalité react UseState.
//Enfin, la fonction réalise un template HTML qui utilise les variables, objets et fonctions précédemment cités.