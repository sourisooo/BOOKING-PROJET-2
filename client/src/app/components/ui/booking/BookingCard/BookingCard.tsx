import { Paper } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeBooking } from '../../../../store/bookings';
import { getRoomById, removeBookingRoom } from '../../../../store/rooms';
import { BookingType } from '../../../../types/types';
import { getDateDDMMYYYY } from '../../../../utils/formatDate';
import Button from '../../../common/Button';
import { getGuestsLabel } from '../../GuestsCounter/GuestsCounter';
import RoomCard from '../../rooms/RoomCard';

const BookingCard: React.FC<BookingType> = ({
  _id,
  arrivalDate,
  departureDate,
  adults,
  children,
  babies,
  totalPrice,
  roomId,
}) => {
  const dispatch = useDispatch();
  const room = useSelector(getRoomById(roomId));

  const handleRemoveBooking = () => {
    dispatch(removeBooking(_id));
    dispatch(removeBookingRoom({ roomId, _id: _id || '' }));
  };

  return (
    <Paper className='booking-card'>
      <div className='booking-card__wrapper'>
        <div className='booking-content'>
          <h2>
            № <span>{_id}</span>
          </h2>
          <h3 className='booking-info__title'>Информация о бронировании</h3>
          <table className='booking-info'>
            <tbody className='booking-info__body'>
              <tr className='booking-info__item'>
                <td>Дата прибытия:</td>
                <td>
                  <span>{`${getDateDDMMYYYY(arrivalDate)}`}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>Дата выезда:</td>
                <td>
                  <span>{`${getDateDDMMYYYY(departureDate)}`}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>Количество гостей:</td>
                <td>
                  <span>{getGuestsLabel(adults, children, babies)}</span>
                </td>
              </tr>
              <tr className='booking-info__item'>
                <td>Стоимость бронирования:</td>
                <td>
                  <span>{`${totalPrice}`}&#8381;</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='booking-card__btns'>
          <div style={{ width: '100%' }}>
            <RoomCard
              _id={room?._id || 'id not found'}
              roomNumber={room?.roomNumber || 'not found'}
              price={room?.price || 0}
              type={room?.type}
              images={room?.images}
              comforts={room?.comforts}
            />
          </div>
          <Link to={`/rooms/${roomId}`}>
            <Button size='small' fullWidth>
              Перейти на страницу номера
            </Button>
          </Link>
          <Button size='small' variant='outlined' color='error' onClick={handleRemoveBooking}>
            Отменить бронирование
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default BookingCard;

//Commentaires
//La fonction BookingCard prend pour entrée un objet de type bookingtype, l'appel à la fonction
//getRoomById issue des scénaris du reducer room est réalisé pour récupérer le id de room.
//La fonction handleRemoveBooking  fait appel aux scénaris issus des reducers room et booking.
//La fonction BookingCard retourne un template HTML reprenant l'ensemble des fonctions et variables
//ou objets définis précédemment ainsi que les datas issus de la feuille code roomcard ainsi que
//la fonction getGuestsLabel qui permet de retourner un template HTML spécifque au nombre et type
//de guest (prise en charge par la feuille de code GuestCounter).
