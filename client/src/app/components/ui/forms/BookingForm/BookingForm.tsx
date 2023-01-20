import { ArrowRight } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Form, useForm, useModal } from '../../../../hooks';
import { getSearchQueryData } from '../../../../services/sessionStorage.service';
import { createBooking, getBookingCreatedStatus, getBookingsErrors } from '../../../../store/bookings';
import { useAppDispatch } from '../../../../store/createStore';
import { addBookingRoom } from '../../../../store/rooms';
import { getCurrentUserId } from '../../../../store/users';
import { BookingType } from '../../../../types/types';
import Button from '../../../common/Button';
import { DateOfStayField } from '../../../common/Fields';
import GuestsCounter from '../../GuestsCounter';
import { SuccessBookingModal } from '../../modals';
import BookingFormPriceInfo from './BookingFormPriceInfo';
import validatorConfig from './validatorConfig';

const oneDayMs = 86_000_000;

const BookingForm = () => {
  const searchQueryData = getSearchQueryData();

  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useAppDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const currentUserId = useSelector(getCurrentUserId());
  const bookingCreateStatusLoading = useSelector(getBookingCreatedStatus());
  const bookingError = useSelector(getBookingsErrors());
  const { isOpen, handleOpenModal, handleCloseModal } = useModal();

  const initialData = {
    arrivalDate: searchQueryData.arrivalDate || Date.now(),
    departureDate: searchQueryData.departureDate || Date.now() + oneDayMs,
    adults: searchQueryData.adults || 1,
    children: searchQueryData.children || 0,
    babies: searchQueryData.babies || 0,
    userId: currentUserId || 'not found',
    roomId: roomId,
    totalPrice: 0,
  };
  const { data, errors, enterError, setEnterError, handleInputChange, handleResetForm, handleKeyDown, validate } =
    useForm(initialData, false, validatorConfig);

  const countDays = Math.max(1, Math.round((data.departureDate - data.arrivalDate) / oneDayMs));

  useEffect(() => {
    if (!currentUserId) {
      setEnterError('Войдите, чтобы забронировать номер');
    }
    if (bookingError) {
      if (bookingError === 'BOOKING_EXIST') {
        setEnterError('На выбранные вами даты номер забронирован ');
      }
      if (bookingError === 'На сервере произошла ошибка. Попробуйте позже') {
        setEnterError('Упс, что-то пошло не так, попробуйте позже');
      }
    }
  }, [currentUserId, bookingError]);

  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validate(data)) {
      const payload = {
        ...data,
        totalPrice,
      };
      try {
        dispatch(createBooking(payload)).then((bookingData: BookingType) => {
          if (bookingData) {
            dispatch(addBookingRoom(bookingData)).then(() => handleOpenModal());
            handleResetForm(event);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Form data={data} errors={errors} handleChange={handleInputChange} handleKeyDown={handleKeyDown}>
        <DateOfStayField onChange={handleInputChange} data={data} />
        <GuestsCounter onChange={handleInputChange} data={data} />
        <BookingFormPriceInfo
          roomId={roomId}
          totalPrice={totalPrice}
          countDays={countDays}
          setTotalPrice={setTotalPrice}
        />
        <Button
          endIcon={<ArrowRight />}
          type='submit'
          className='form-btn__submit mt-0'
          onClick={handleSubmit}
          disabled={Object.keys(errors).length > 0 || !!enterError}
          fullWidth
        >
          Забронировать
        </Button>
      </Form>
      {enterError && <p className='form__enter-error'>{enterError}</p>}
      <SuccessBookingModal
        open={isOpen}
        onClose={handleCloseModal}
        isLoading={bookingCreateStatusLoading}
        bookingData={data}
      />
    </>
  );
};

export default BookingForm;


//Commentaires
//La fonction BookingForm returne un template HTML. Ce template HTML est alimenté par 
// sessionStorage.service (stockage de donnée spécifique sur le disque locale), des fonctions
//issues de users et bookings (essentiellement les gets), la fonction useForm qui est invoquer puis destructurée
//afin de pouvoir utiliser ses paramètres. Useeffect est paramétrer de manière à gérer les erreurs 
//lorssque currentUserId ou bookingError sont modifiés. La fonction handleSubmit  prend pur entrée
//une élément HTML form élément:button et récupére la data (valeur actuelle dans  UseForm) pour constituer
//le payload en associant à data, la variable totalPrice usant la fonctionnalité useState.
// Ensuite, le reducer booking est appelé pour utiliser les scénaris createBooking (avec le paramètre de méthode payload) et 
//addBookingRoom ( avec pour paramètre le resultat de la fonction précédente) pour utliser les reducers respectifs booking et room.
//qui eux meme vont appelé les fonctions roomsservice et bookingservice qui vont gérer les requetes HTML auprès du serveur 
//notemment les requetes (POST). Le contenu du template HTML retournée par la fonction BookingForm utilise toutes
//les données principalement citées.