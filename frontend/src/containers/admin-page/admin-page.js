import React, { useEffect, useState } from 'react';
import {
    Tabs,
    Tab,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Modal,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import Header from '../../components/header/header';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import './admin-page.sass';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AdminPage() {
    const [value, setValue] = useState(0);
    const [orders, setOrders] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [selectedDishId, setSelectedDishId] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedDishIdForEdit, setSelectedDishIdForEdit] = useState('');
    const [dishDataEdit, setDishDataEdit] = useState({
        ingredients: [],
        // Initialize ingredients as an empty array
    });
    const [dishDataCreate, setDishDataCreate] = useState({
        name: '',
        description: '',
        price: 0,
        ingredients: [
            {
                name: '',
                quantity: 0,
                unit: '',
            },
        ],
        category: '',
        image: '',
        created_at: new Date()
    });
    
    const [restaurants, setRestaurants] = useState([{}]);
    const [createDishRestaurant, setCreateDishRestaurant] = useState('');
    const restaurantOptions = restaurants.map((restaurant) => (
        <MenuItem key={restaurant._id} value={restaurant._id}>
            {restaurant.name}
        </MenuItem>
    ));

    const openEditModal = (dishId) => {
        setSelectedDishIdForEdit(dishId);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedDishIdForEdit('');
    };

    const openCreateModal = (dishId) => {
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const confirmEdit = async () => {
        try {
            dishDataEdit.created_at = new Date();
            await axios.patch(`http://localhost:3002/dish/update/${selectedDishIdForEdit}`, dishDataEdit);
            console.log('Changed');
            closeEditModal();
        } catch (error) {
            console.error(error);
            // Handle edit error
        }
    };

    const confirmCreate = async () => {
        try {
            await axios.post(`http://localhost:3002/dish/${createDishRestaurant}`, dishDataCreate);
            console.log('Created');
            fetchDishes();
            closeCreateModal();
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        fetchOrders();
        fetchDishes();
        fetchRestaurants();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3002/order/many');
            const sortedOrders = response.data.sort((a, b) => b.date - a.date);
            setOrders(sortedOrders);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDishes = async () => {
        try {
            const response = await axios.get('http://localhost:3002/dish');
            setDishes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const response = await axios.get('http://localhost:3002/restaurant');
            setRestaurants(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const findRestaurantByDishId = (restaurants, dishId) => {
        const restaurant = restaurants.find(restaurant => restaurant.dishes.some(dish => dish === dishId));
        return restaurant ? restaurant._id : null;
      };
      
      const handleDishDelete = async (dishId) => {
        try {
          await fetchRestaurants(); // Дождаться обновления restaurants
          const restaurantId = findRestaurantByDishId(restaurants, dishId);
          if (restaurantId) {
            await axios.delete(`http://localhost:3002/dish/delete/${dishId}`, { data: { id: restaurantId } });
            console.log(restaurantId);
            console.log('Deleted');
            fetchDishes();
          } else {
            console.log('Restaurant not found');
          }
        } catch (error) {
          console.error(error);
          // Handle delete error
        }
      };
      

    const openDeleteConfirmation = (dishId) => {
        setSelectedDishId(dishId);
        setDeleteConfirmationOpen(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationOpen(false);
        setSelectedDishId('');
    };

    const confirmDelete = () => {
        handleDishDelete(selectedDishId);
        closeDeleteConfirmation();
    };

    useEffect(() => {
        if (selectedDishIdForEdit) {
            fetchDishEdit();
        }
    }, [selectedDishIdForEdit]);

    const fetchDishEdit = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/dish/${selectedDishIdForEdit}`);
            setDishDataEdit(response.data);
        } catch (error) {
            console.error(error);
            // Handle fetch error
        }
    };


    const handleInputChange = (event, field) => {
        setDishDataEdit((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handleIngredientChange = (event, index, property) => {
        const { value } = event.target;
        setDishDataEdit((prevData) => {
            const updatedIngredients = [...prevData.ingredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [property]: value
            };
            return {
                ...prevData,
                ingredients: updatedIngredients
            };
        });
    };

    const handleInputChangeCreate = (event, field) => {
        setDishDataCreate((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handleIngredientChangeCreate = (event, index, property) => {
        const { value } = event.target;
        setDishDataCreate((prevData) => {
            const updatedIngredients = [...prevData.ingredients];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                [property]: value
            };
            return {
                ...prevData,
                ingredients: updatedIngredients
            };
        });
    };

    const addIngredient = () => {
        setDishDataEdit((prevData) => ({
            ...prevData,
            ingredients: [
                ...prevData.ingredients,
                { name: '', quantity: 0, unit: '' }
            ]
        }));
    };
    const deleteIngredient = (index) => {
        setDishDataEdit((prevData) => {
            const ingredients = [...prevData.ingredients];
            ingredients.splice(index, 1);
            return {
                ...prevData,
                ingredients,
            };
        });
    };
    const deleteIngredientCreate = (index) => {
        setDishDataCreate((prevData) => {
            const ingredients = [...prevData.ingredients];
            ingredients.splice(index, 1);
            return {
                ...prevData,
                ingredients,
            };
        });
    };
    const addIngredientCreate = () => {
        setDishDataCreate((prevData) => ({
            ...prevData,
            ingredients: [
                ...prevData.ingredients,
                { name: '', quantity: 0, unit: '' }
            ]
        }));
    };

    

    return (
        <>
            <Header />
            <Tabs style={{ marginTop: '80px' }} value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab key="orders" label="Orders" {...a11yProps(0)} />
                <Tab key="dishes" label="Dishes" {...a11yProps(1)} />
                <Tab key="restaurants" label="Restaurants" {...a11yProps(2)} />
                <Tab key="tables" label="Tables" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <div>
                    <ul className="order__list">
                        {orders &&
                            orders.map((order) => (
                                <li key={order._id}>
                                    <p>Час замовлення: {new Date(order.date).toLocaleString()}</p>
                                    <p>Ім'я користувача: {order.user?.name}</p>
                                    <p>Телефон: {order.user?.phone}</p>
                                    <ul>
                                        {order.dishes.map((dish) => (
                                            <li key={dish._id}>
                                                <p>Страва: {dish.dish_id?.name}</p>
                                                <p>Кількість: {dish.count}</p>
                                                <p>Ціна за 1: {dish.dish_id?.price}</p>
                                                <p>Ціна: {+dish.dish_id?.price * +dish.count}</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <p>Загальна вартість: {order.total_price}</p>
                                </li>
                            ))}
                    </ul>
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div>
                    <ul className="dish__list">
                        {dishes &&
                            dishes.map((dish, index) => (
                                <li key={dish._id}>
                                    <span className="dish__title">
                                        {index + 1} {dish.name}{' '}
                                        <span className="dish__icons">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => openDeleteConfirmation(dish._id)} />
                                            <FontAwesomeIcon icon={faPencil} onClick={() => openEditModal(dish._id)} />
                                        </span>
                                    </span>
                                </li>
                            ))}
                    </ul>
                    <Button onClick={() => {openCreateModal()}}>Create Dish</Button>
                    <Modal open={editModalOpen} onClose={closeEditModal}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                <FormControl>
                                    <InputLabel shrink>Name</InputLabel>
                                    <TextField
                                        value={dishDataEdit.name}
                                        onChange={(event) => handleInputChange(event, "name")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Description</InputLabel>
                                    <TextField
                                        value={dishDataEdit.description}
                                        onChange={(event) => handleInputChange(event, "description")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Price</InputLabel>
                                    <TextField
                                        type="number"
                                        value={dishDataEdit.price}
                                        onChange={(event) => handleInputChange(event, "price")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Category</InputLabel>
                                    <TextField
                                        value={dishDataEdit.category}
                                        onChange={(event) => handleInputChange(event, "category")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Image</InputLabel>
                                    <TextField
                                        value={dishDataEdit.image}
                                        onChange={(event) => handleInputChange(event, "image")}
                                        required
                                    />
                                </FormControl>

                                {dishDataEdit.ingredients.map((ingredient, index) => (
                                    <div key={ingredient._id} className='ingredient__wrappper'>
                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Ingredient ${index + 1} Name`}
                                                value={ingredient.name}
                                                onChange={(event) => handleIngredientChange(event, index, "name")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Quantity`}</InputLabel>
                                            <TextField
                                                type="number"
                                                label={`Ingredient ${index + 1} Quantity`}
                                                value={ingredient.quantity}
                                                onChange={(event) => handleIngredientChange(event, index, "quantity")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Unit`}</InputLabel>
                                            <TextField
                                                label={`Ingredient ${index + 1} Unit`}
                                                value={ingredient.unit}
                                                onChange={(event) => handleIngredientChange(event, index, "unit")}
                                                required
                                            />
                                        </FormControl>
                                        <Button onClick={() => deleteIngredient(index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addIngredient}>
                                    Add Ingredient
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmEdit}>
                                    Change
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal open={createModalOpen} onClose={closeCreateModal}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                <Select value={createDishRestaurant} onChange={(event) => setCreateDishRestaurant(event.target.value)}>
                                    {restaurantOptions}
                                </Select>
                                <FormControl>
                                    <InputLabel shrink>Name</InputLabel>
                                    <TextField
                                        value={dishDataCreate.name}
                                        onChange={(event) => handleInputChangeCreate(event, "name")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Description</InputLabel>
                                    <TextField
                                        value={dishDataCreate.description}
                                        onChange={(event) => handleInputChangeCreate(event, "description")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Price</InputLabel>
                                    <TextField
                                        type="number"
                                        value={dishDataCreate.price}
                                        onChange={(event) => handleInputChangeCreate(event, "price")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Category</InputLabel>
                                    <TextField
                                        value={dishDataCreate.category}
                                        onChange={(event) => handleInputChangeCreate(event, "category")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Image</InputLabel>Create
                                    <TextField
                                        value={dishDataCreate.image}
                                        onChange={(event) => handleInputChangeCreate(event, "image")}
                                        required
                                    />
                                </FormControl>

                                {dishDataCreate.ingredients.map((ingredient, index) => (
                                    <div key={ingredient._id} className='ingredient__wrappper'>
                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Ingredient ${index + 1} Name`}
                                                value={ingredient.name}
                                                onChange={(event) => handleIngredientChangeCreate(event, index, "name")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Quantity`}</InputLabel>
                                            <TextField
                                                type="number"
                                                label={`Ingredient ${index + 1} Quantity`}
                                                value={ingredient.quantity}
                                                onChange={(event) => handleIngredientChangeCreate(event, index, "quantity")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Ingredient ${index + 1} Unit`}</InputLabel>
                                            <TextField
                                                label={`Ingredient ${index + 1} Unit`}
                                                value={ingredient.unit}
                                                onChange={(event) => handleIngredientChangeCreate(event, index, "unit")}
                                                required
                                            />
                                        </FormControl>
                                        <Button onClick={() => deleteIngredientCreate(index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addIngredientCreate}>
                                    Add Ingredient
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmCreate}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this dish?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDeleteConfirmation} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDelete} color="primary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
                {/* Restaurants content */}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {/* Tables content */}
            </TabPanel>
        </>
    );
}

export default AdminPage;
