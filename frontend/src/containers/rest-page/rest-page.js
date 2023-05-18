import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import './rest-page.sass';

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
  const [selectedTable, setSelectedTable] = useState('');

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
          restaurantResponse.data.dishes.map((dishId) => axios.get(`http://localhost:3002/dish/${dishId}`))
        );
        const dishData = dishResponses.map((res) => ({ ...res.data, id: res.data._id, count: 0 }));

        setDishes(dishData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
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

    fetchTables();
  }, [restaurant.tables]);

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
    const user = '645fee2c71912c47e8fffdfd'; // Замените на фактический id пользователя

    // Получение текущей даты
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const order = {
      user,
      dishes: dishes.filter((dish) => dish.count >= 1).map((dish) => ({ id: dish.id, count: dish.count })),
      total_price,
      data: tableDate || currentDate, // Используем переданную дату, если она есть, иначе используем текущую дату
    };
    console.log(order);
    // axios.post('http://localhost:3002/order/one', order)
    // .then(response => {
    //   console.log(response.data); // Обработка ответа от сервера
    // })
    // .catch(error => {
    //   console.error(error); // Обработка ошибок при отправке запроса
    // });
    // Вывод объекта заказа в консоль (для тестирования)
    // Отправка заказа на сервер - добавьте соответствующий код здесь
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
    setTotalPrice(total_price);
  }, [dishes]);

  const [selectedTableNumber, setSelectedTableNumber] = useState('');
  
  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
  };
  


  const handleReservation = () => {
    const selectedTableData = tables.find((table) =>
      table.tableNumbers.some((tableNumber) => tableNumber.number === selectedTable)
    );
    console.log("Selected Table:", selectedTable);
    console.log("Tables:", tables);
  
    if (selectedTableData) {
      const selectedTableNumberObj = selectedTableData.tableNumbers.find((tableNumber) => tableNumber.number === selectedTable);
      const selectedTableId = selectedTableNumberObj ? selectedTableNumberObj.id : null;
      console.log("Selected table:", selectedTableData);
      console.log("Table ID:", selectedTableId);
      setSelectedTable(selectedTableNumberObj); // Update the state with the selected table data
      // Perform the reservation logic here
    }
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
          <div className="tables__modal__wrapper"><h2>Бронювання столика</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker value={selectedDate} onChange={(newDate) => handleDateChange(newDate)} />
          </LocalizationProvider>
          <div className="tables__wrapper">
            {tables.map((table) => (
              <div key={table.id}>
                <Typography variant="subtitle1">Кількість людей {table.capacity}</Typography>
                <RadioGroup aria-label="table" name="table" value={selectedTable} onChange={handleTableChange}>
                  {table.tableNumbers.map((tableNumber) => (
                    <FormControlLabel
                      key={tableNumber.number}
                      value={tableNumber.number}
                      control={<Radio />}
                      label={tableNumber.number}
                    />
                  ))}
                </RadioGroup>
                <Button variant="contained" onClick={handleReservation}>
                  Забронювати
                </Button>
              </div>
            ))}
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
                          dishCount={dishCopy.count} // Замените dishCopy.count на dishCount
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
