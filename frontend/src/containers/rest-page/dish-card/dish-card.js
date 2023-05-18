import React from 'react';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './dish-card.sass';

function DishCard({ dish, handleCountChange, dishCount }) {
  const { id, image, name, description, ingredients, price } = dish;

  const formatData = (item) => {
    const { name, quantity, unit } = item;
    const unitText = unit === 'piece' ? 'p' : 'g';
    return `${name}(${quantity}${unitText})`;
  };

  const formattedList = ingredients.map(formatData).join(', ');

  const handleIncrement = () => {
    handleCountChange(id, dishCount + 1);
  };

  const handleDecrement = () => {
    if (dishCount > 0) {
      handleCountChange(id, dishCount - 1);
    }
  };
  

  const calculatePrice = () => {
    if (dishCount === 0) {
      return price;
    } else {
      return price * dishCount;
    }
  };
  return (
    <div className="dish-card__wrapper">
      <div className="dish-card__img">
        <img src={image} alt={`Dish ${name}`} />
      </div>
      <div className="dish-card__name">{name}</div>
      <div className="dish-card__descr">{description}</div>
      <div className="dish-card__ingr">{formattedList}</div>
      <div className="dish-card__price">{calculatePrice()}</div>
      <div className="dish-card__count">
        <div className="count-btn" onClick={handleDecrement}>
          <FontAwesomeIcon icon={faCircleMinus} />
        </div>
        <div className="count-value">{dishCount}</div>
        <div className="count-btn" onClick={handleIncrement}>
          <FontAwesomeIcon icon={faCirclePlus} />
        </div>
      </div>
    </div>
  );
}


export default DishCard;
