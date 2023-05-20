import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Modal,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Header from '../../components/header/header';
import Carousel from 'react-bootstrap/Carousel';
import DishCard from './dish-card/dish-card';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import queryString from 'query-string';
import './rest-page.sass';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';

function RestPage({ tableDate }) {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [restaurant, setRestaurant] = useState({});
  const [dishes, setDishes] = useState([]);
  const [total_price, setTotalPrice] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs(queryParams.date));
  const [tables, setTables] = useState([]);
  const [message, setMessage] = useState ('');
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantResponse = await axios.get(`http://localhost:3002/restaurant/${id}`);
        setRestaurant(restaurantResponse.data);
        const dishResponses = await Promise.all(
          restaurantResponse.data.dishes.map(dishId => axios.get(`http://localhost:3002/dish/${dishId}`))
        );
        const dishData = dishResponses
        .map((res) => ({
          ...res.data,
          id: res.data._id,
          count: 0
        }));
  
        setDishes(dishData);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [id]);
  
  

  const fetchTables = async () => {
    try {
      const tableResponses = await Promise.all(
        restaurant.tables.map((tableId) => axios.get(`http://localhost:3002/table/${tableId}`))
      );
      const tableData = tableResponses.map((res) => res.data);
      setTables(tableData);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchTables();
  }, [restaurant.tables,selectedDate]);

  const openGoogleMaps = () => {
    const address = encodeURIComponent(restaurant.address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(googleMapsUrl, '_blank');
  };

  const formatEmail = (email) => {
    const formattedEmail = `mailto:${email}`;
    return formattedEmail;
  };

  const uniqueCategories = [...new Set(dishes.map((dish) => dish.category))];

  const handleOrder = () => {
    const token = Cookies.get('access_token');
    const userId = decodeToken(token);
    const user = userId;  // Replace with the actual user ID

    // Get current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const order = {
      user: user,
      dishes: dishes.filter((dish) => dish.count >= 1).map((dish) => ({ dish_id: dish.id, count: dish.count, _id: user })),
      total_price,
      date: tableDate || currentDate, // Use the passed date if available, otherwise use the current date
    };
    if(order.total_price>0){
    axios
      .post(`http://localhost:3002/order/one`, order, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((response) => {
        console.log(response.data); // Handle server response

        // Reset dish count values to 0
        setDishes((prevDishes) =>
          prevDishes.map((prevDish) => {
            return { ...prevDish, count: 0 };
          })
        );
      })
      .catch((error) => {
        console.error(error); // Handle request errors
      });
    }
  };


  const handleCountChange = (dishId, dishCount) => {
    setDishes((prevDishes) =>
      prevDishes.map((prevDish) => {
        if (prevDish.id === dishId) {
          return { ...prevDish, count: dishCount };
        }
        return prevDish;
      })
    );
  };

  useEffect(() => {
    const total_price = dishes.reduce((total, dish) => {
      return total + dish.price * dish.count;
    }, 0);
    setTotalPrice(total_price.toFixed(2));
  }, [dishes]);


  const [selectedTable, setSelectedTable] = useState(null);

  const handleReservation = (date) => {
    const selectedDay = selectedDate.startOf('day').format('YYYY-MM-DD');
    const token = Cookies.get('access_token');
    if (selectedTable) {
      // Находим объект номера стола по выбранному номеру
      const selectedTableNumberObject = tables
        .flatMap((table) => table.tableNumbers)
        .find((tableNumber) => tableNumber.number === selectedTable);
      if (selectedTableNumberObject) {
        console.log('Номер стола:', selectedTable);
        // Берем ID номера стола из объекта
        const tableId = selectedTableNumberObject._id;
        console.log('ID стола:', tableId);
        // Формируем объект для обновления данных на сервере
        const tableUpdate = {
          id: tableId,
          dates: date,
        };
        console.log('Дата:', date);
        axios
          .put(`http://localhost:3002/table/availability`, tableUpdate, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            // Handle server response
            // Reset dish count values to
            setMessage('Ви успішно забронювали стіл!');
            setTimeout(() =>{closeModal()}, 2000);
            fetchTables(); // Первый вызов fetchTables
          })
          .catch((error) => {
            console.error(error);
            // Handle request errors
          });
        fetchTables();
      }
    }
  };

  const isDateUnavailable = (table, selectedDate) => {
    const selectedDay = selectedDate.startOf('day').format('YYYY-MM-DD');
    return table.unavailableDates.some(date => date.startsWith(selectedDay));
  };



  return (
    <>
      <Header page="rest" />
      <div className="rest-info__wrapper">
        <div className="rest-info__name">{restaurant.name}</div>
        <div className="rest-info__descr">{restaurant.description}</div>
        <div className="rest-info__address">
          <a href="#" onClick={openGoogleMaps}>
            {restaurant.address}
          </a>
        </div>
        <div className="rest-info__phone">
          <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
        </div>
        <div className="rest-info__email">
          <a href={formatEmail(restaurant.email)}>{restaurant.email}</a>
        </div>
        <div className="rest-info__rating">{restaurant.rating}</div>
        <button className="rest-info__btn" variant="contained" onClick={openModal}>
          Забронювати стіл
        </button>
      </div>
      <Modal open={modalVisible} onClose={closeModal}>
        <div className="modal__content">
          <div className="tables__modal__wrapper">
            <h2>Бронювання столика</h2>
            <p>{message}</p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker value={selectedDate} onChange={(newDate) => handleDateChange(newDate)} />
            </LocalizationProvider>
            <div className="tables__wrapper">
              {tables.map((table) => (
                <div className='table_id' key={table._id}>
                  <Typography variant="subtitle1">Кількість людей {table.capacity}</Typography>
                  <RadioGroup aria-label="table" name="table">
                    {table.tableNumbers.map((tableNumber) => {
                      const isUnavailable = isDateUnavailable(tableNumber, selectedDate);
                      return (
                        !isUnavailable && (
                          <FormControlLabel
                            key={tableNumber._id}
                            value={tableNumber.number}
                            control={<Radio />}
                            label={tableNumber.number}
                            checked={selectedTable === tableNumber.number}
                            onChange={() => setSelectedTable(tableNumber.number)}
                          />
                        )
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
              <Button variant="contained" onClick={() => handleReservation(selectedDate)} disabled={!selectedTable}>
                Забронювати
              </Button>
            </div>
          </div>
          <Button onClick={closeModal}>Закрити</Button>
        </div>
      </Modal>

      <div className="rest-img-slider__wrapper">
        <Carousel interval={10000}>
          {restaurant.photos &&
            restaurant.photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img className="rest-img-slider__item" src={`${photo}`} alt={`Photo ${index + 1}`} />
              </Carousel.Item>
            ))}
        </Carousel>
      </div>
      {dishes.length > 0 && (
        <div className="dish-cards__wrapper accordion-container">
          <span className="menu-title">Menu:</span>
          {uniqueCategories.map((category) => (
            <Accordion key={category}>
              <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`${category}-content`} id={`${category}-header`}>
                <Typography>{category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="dish-cards__wrapper">
                  {dishes
                    .filter((dish) => dish.category === category)
                    .map((dish) => {
                      const dishCopy = { ...dish };
                      return (
                        <DishCard
                          key={dishCopy.id}
                          dish={dishCopy}
                          handleCountChange={handleCountChange}
                          dishCount={dishCopy.count} // Replace dishCopy.count with dishCount
                        />
                      );
                    })}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
          <div className="order__wrapper">
            <div className="rest-info__total-price">Total Price: {total_price}</div>
            <button className="rest-info__btn order__btn" variant="contained" onClick={handleOrder}>
              Order
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default RestPage;
