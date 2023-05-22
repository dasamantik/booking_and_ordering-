import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/footer';
import Header from '../../components/header/header';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import './main-page.sass';
import RestCard from './card/card';

function MainPage() {
  const [value, setValue] = React.useState(dayjs());
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [totalFilteredRestaurants, setTotalFilteredRestaurants] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
  const [searchName, setSearchName] = useState('');
  const cardsPerPage = 3;

  useEffect(() => {
    fetchData();
  }, [value]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/restaurant');
      const sortedRestaurants = response.data.sort((a, b) => b.rating - a.rating);

      const filtered = sortedRestaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchName.toLowerCase())
      );

      setRestaurants(sortedRestaurants);
      setFilteredRestaurants(filtered);
      setTotalFilteredRestaurants(filtered.length);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = filteredRestaurants.slice(indexOfFirstCard, indexOfLastCard);
    setDisplayedRestaurants(currentCards);
  }, [currentPage, filteredRestaurants]);

  return (
    <>
      <Header page='main' />
      <div className="rest-list__wrapper">
        <form className="rest-list__filter" >
          <TextField
            id="outlined-basic"
            label="Назва закладу"
            variant="outlined"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Оберіть дату"
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>
          <button className="rest-list__btn" type="submit" onClick={handleFormSubmit}>Пошук</button>
        </form>
        <ul className="rest-list">
          {displayedRestaurants.length > 0 ? (
            displayedRestaurants.map((restaurant) => (
              <Link style={{ all: 'unset' }} key={restaurant._id} to={`/restaurant/${restaurant._id}?date=${value}`}>
                <RestCard
                  key={restaurant._id}
                  photos={restaurant.photos[0]}
                  name={restaurant.name}
                  description={restaurant.description}
                  address={restaurant.address}
                  rating={restaurant.rating}
                />
              </Link>

            ))
          ) : (
            <p>Результатів не знайдено</p>
          )}
          <Pagination
            count={Math.ceil(totalFilteredRestaurants / cardsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default MainPage;
