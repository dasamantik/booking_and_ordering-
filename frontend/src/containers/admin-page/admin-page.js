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
    MenuItem,
    InputAdornment,
    IconButton
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
    const [tables, setTables] = useState([]);
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
        fetchTables();
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

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:3002/table');
            setTables(response.data);
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
    const [deleteConfirmationOpenRest, setDeleteConfirmationOpenRest] = useState(false);
    const [selectedRestId, setSelectedRestId] = useState('');
    const [editModalOpenRest, setEditModalOpenRest] = useState(false);
    const [selectedRestIdForEdit, setSelectedRestIdForEdit] = useState('');
    const [restDataEdit, setRestDataEdit] = useState({
        photos: []
    });
    const [restDataCreate, setRestDataCreate] = useState({
        name: '',
        description: '',
        address: '',
        phone: 0,
        email: '',
        rating: '',
        photos: ['', ''],
        tables: [],
        dishes: [],
        reviews: [],
    });
    const [createRestDish, setCreateRestDish] = useState('');
    const dishOptions = dishes.map((dish) => (
        <MenuItem key={dish._id} value={dish._id}>
            {dish.name}
        </MenuItem>
    ));
    const [createRestTable, setCreateRestTable] = useState('');
    const tableOptions = tables.map((table) => (
        <MenuItem key={table._id} value={table._id}>
            Місць - {table.capacity}  Столів - {table.tableNumbers.length}
        </MenuItem>
    ));
    const [createModalOpenRest, setCreateModalOpenRest] = useState(false);
    const openCreateModalRest = (dishId) => {
        setCreateModalOpenRest(true);
    };

    const closeCreateModalRest = () => {
        setCreateModalOpenRest(false);
    };

    const handleRestDelete = async (restId) => {
        try {// Дождаться обновления restaurants

            await axios.delete(`http://localhost:3002/restaurant/delete/${restId}`);
            console.log('Rest deleted');
            fetchRestaurants();

        } catch (error) {
            console.error(error);
            // Handle delete error
        }
    };

    const openDeleteConfirmationRest = (restId) => {
        setSelectedRestId(restId);
        setDeleteConfirmationOpenRest(true);
    };

    const closeDeleteConfirmationRest = () => {
        setDeleteConfirmationOpenRest(false);
        setSelectedRestId('');
    };

    const confirmDeleteRest = () => {
        handleRestDelete(selectedRestId);
        closeDeleteConfirmationRest();
        fetchRestaurants();
    };

    const openEditModalRest = (RestId) => {
        fetchRestEdit();
        setSelectedRestIdForEdit(RestId);
        setEditModalOpenRest(true);

    };

    const closeEditModalRest = () => {
        setEditModalOpenRest(false);
        setSelectedRestIdForEdit('');
    };

    const fetchRestEdit = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/restaurant/${selectedRestIdForEdit}`);
            setRestDataEdit(response.data);
        } catch (error) {
            console.error(error);
            // Handle fetch error
        }
    };

    const handleInputChangeRest = (event, field) => {
        setRestDataEdit((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handlePhotoChangeEdit = (event, index) => {
        const { value } = event.target;
        setRestDataEdit((prevData) => {
            const updatedPhotos = [...prevData.photos];
            updatedPhotos[index] = value;
            return {
                ...prevData,
                photos: updatedPhotos,
            };
        });
    };

    const addPhotoEdit = () => {
        setRestDataEdit((prevData) => ({
            ...prevData,
            photos: [...prevData.photos, ''],
        }));
    };

    const deletePhotoEdit = (index) => {
        setRestDataEdit((prevData) => {
            const photos = [...prevData.photos];
            photos.splice(index, 1);
            return {
                ...prevData,
                photos,
            };
        });
    };


    const handleInputChangeRestCreate = (event, field) => {
        setRestDataCreate((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };

    const handlePhotoChangeCreate = (event, index) => {
        const { value } = event.target;
        setRestDataCreate((prevData) => {
            const updatedPhotos = [...prevData?.photos];
            updatedPhotos[index] = value;
            return {
                ...prevData,
                photos: updatedPhotos,
            };
        });
    };;


    const addPhotoCreate = () => {
        setRestDataCreate((prevData) => ({
            ...prevData,
            photos: [...prevData.photos, ''],
        }));
    };

    const deletePhotoCreate = (index) => {
        setRestDataCreate((prevData) => {
            const photos = [...prevData.photos];
            photos.splice(index, 1);
            return {
                ...prevData,
                photos,
            };
        });
    };
    useEffect(() => {
        if (selectedRestIdForEdit) {
            fetchRestEdit();
        }
    }, [selectedRestIdForEdit]);

    const confirmEditRest = async () => {
        try {
            await axios.patch(`http://localhost:3002/restaurant/update/${selectedRestIdForEdit}`, restDataEdit);
            console.log('Changed rest');
            closeEditModalRest();
        } catch (error) {
            console.error(error);
            // Handle edit error
        }
    };

    const confirmCreateRest = async () => {
        console.log(restDataCreate)
        try {
            await axios.post(`http://localhost:3002/restaurant/new`, restDataCreate);
            console.log('Created');
            fetchRestaurants();
            closeCreateModalRest();

        } catch (error) {
            console.error(error);
        }
    }

    const [editModalOpenTable, setEditModalOpenTable] = useState(false);
    const [tableDataEdit, setTableDataEdit] = useState({
        isReserved: false,
        tableNumbers: [
            {
                unavailableDates: [],
                number: 0
            }
        ],
        
    });
    const [tableDataCreate, setTableDataCreate] = useState({
        isReserved: false,
        capacity: 0,
        tableNumbers: [
            {
                number: 0,
                unavailableDates: []
            }
        ],
        updatedAt: new Date(),
        createdAt: new Date(),
        __v: 0
    });
    const [deleteConfirmationOpenTable, setDeleteConfirmationOpenTable] = useState(false);
    const [selectedTableId, setSelectedTableId] = useState('');
    const [selectedTableIdForEdit, setSelectedTableIdForEdit] = useState('');
    const [createModalOpenTable, setCreateModalOpenTable] = useState(false);
    const [createTableRestaurant, setCreateTableRestaurant] = useState('');
    const restOptionsTable = restaurants.map((restaurant) => (
        <MenuItem key={restaurant._id} value={restaurant._id}>
            {restaurant.name}
        </MenuItem>
    ));
    const openDeleteConfirmationTable = (tableId) => {
        setSelectedTableId(tableId);
        setDeleteConfirmationOpenTable(true);
    };

    const closeDeleteConfirmationTable = () => {
        setDeleteConfirmationOpenTable(false);
        setSelectedTableId('');
    };

    const confirmDeleteTable = () => {
        handleTableDelete(selectedTableId);
        closeDeleteConfirmationTable();
        fetchTables();
    };

    const openEditModalTable = async (TableId) => {
        setSelectedTableIdForEdit(TableId);
        fetchTableEdit(TableId);
        setEditModalOpenTable(true);


    };

    const closeEditModalTable = () => {
        setEditModalOpenTable(false);
    };

    const openCreateModalTable = async (TableId) => {
        setCreateModalOpenTable(true);


    };

    const closeCreateModalTable = () => {
        setEditModalOpenTable(false);
    };
    const fetchTableEdit = async (TableId) => {
        try {
            const response = await axios.get(`http://localhost:3002/table/${TableId}`);
            setTableDataEdit(response.data);
        } catch (error) {
            console.error(error);
            // Handle fetch error
        }
    };

    const handleInputChangeTable = (event, field) => {
        setTableDataEdit((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };


    const handleInputChangeTableCreate = (event, field) => {
        setTableDataCreate((prevData) => ({
            ...prevData,
            [field]: event.target.value,
        }));
    };


    const handleTableChangeTable = (event, index, property) => {
        const { value } = event.target;
        setTableDataEdit((prevData) => {
            const updatedTables = [...prevData.tableNumbers];
            updatedTables[index] = {
                ...updatedTables[index],
                [property]: value
            };
            return {
                ...prevData,
                tableNumbers: updatedTables
            };
        });
    };

    const handleTableChangeTableCreate = (event, index, property) => {
        const { value } = event.target;
        setTableDataCreate((prevData) => {
            const updatedTables = [...prevData.tableNumbers];
            updatedTables[index] = {
                ...updatedTables[index],
                [property]: value
            };
            return {
                ...prevData,
                tableNumbers: updatedTables
            };
        });
    };

    const addSmallTable = () => {
        setTableDataEdit((prevData) => ({
            ...prevData,
            tableNumbers: [
                ...prevData.tableNumbers,
                { _id: '', number: 0, unavailableDates: [] }
            ]
        }));
    };

    const deleteSmallTable = (index) => {
        setTableDataEdit((prevData) => {
            const tableNumbers = [...prevData.tableNumbers];
            tableNumbers.splice(index, 1);
            return {
                ...prevData,
                tableNumbers,
            };
        });
    };

    const deleteDate = (tableIndex, dateIndex) => {
        setTableDataEdit((prevData) => {
            const tableNumbers = [...prevData.tableNumbers];
            const table = tableNumbers[tableIndex];
            table.unavailableDates.splice(dateIndex, 1);
            return {
                ...prevData,
                tableNumbers,
            };
        });
    };

    const addSmallTableCreate = () => {
        setTableDataCreate((prevData) => ({
            ...prevData,
            tableNumbers: [
                ...prevData.tableNumbers,
                { _id: '', number: 0, unavailableDates: [] }
            ]
        }));
    };

    const deleteSmallTableCreate = (index) => {
        setTableDataCreate((prevData) => {
            const tableNumbers = [...prevData.tableNumbers];
            tableNumbers.splice(index, 1);
            return {
                ...prevData,
                tableNumbers,
            };
        });
    };

    const deleteDateCreate = (tableIndex, dateIndex) => {
        setTableDataCreate((prevData) => {
            const tableNumbers = [...prevData.tableNumbers];
            const table = tableNumbers[tableIndex];
            table.unavailableDates.splice(dateIndex, 1);
            return {
                ...prevData,
                tableNumbers,
            };
        });
    };


    const findRestaurantByTableId = (restaurants, tableId) => {
        const restaurant = restaurants.find(restaurant => restaurant.tables.some(table => table === tableId));
        return restaurant ? restaurant._id : null;
    };
    const handleTableDelete = async (tableId) => {
        try {
            await fetchRestaurants(); // Дождаться обновления restaurants
            const restaurantId = findRestaurantByTableId(restaurants, tableId);
            if (restaurantId) {
                await axios.delete(`http://localhost:3002/table/${tableId}`, { data: { id: restaurantId } });
                console.log('Deleted');
                fetchTables();
            } else {
                console.log('Restaurant not found');
            }
        } catch (error) {
            console.error(error);
            // Handle delete error
        }
    };


    const confirmEditTable = async () => {
        console.log(selectedTableIdForEdit);
        const updatedTableNumbers = tableDataEdit.tableNumbers.map(obj => {
            obj.number = parseInt(obj.number);
            const { _id, ...rest } = obj;
            return rest;
          });
            

        tableDataEdit.tableNumbers = updatedTableNumbers;
        console.log(JSON.stringify(tableDataEdit));
        await axios.patch(`http://localhost:3002/table/mod/${selectedTableIdForEdit}`, tableDataEdit)
        .then((response) => {
            console.log(response.data);
        closeEditModalTable();
        fetchTables();
        }).catch((error) => {
            if (error.response) {
              // Error with a server response
              console.error(error.response.data);
            } else {
              // Other error
              console.error('An error occurred');
            }
          });
    }

    const confirmCreateTable = async () => {
        console.log(tableDataCreate)
        
        try {
            await axios.post(`http://localhost:3002/table/${createTableRestaurant}`, tableDataCreate);
            console.log('Created table');
            fetchTables();
            closeCreateModalTable();

        } catch (error) {
            console.error(error);
        }
    }

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
                    <Button onClick={() => { openCreateModal() }}>Create Dish</Button>
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
                                <Button variant="contained" color="primary" onClick={() => closeCreateModal()}>
                                    Close
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
                <div>
                    <ul className="rest__list">
                        {restaurants &&
                            restaurants.map((rest, index) => (
                                <li key={rest._id}>
                                    <span className="rest__title">
                                        {index + 1} {rest.name}{' '}
                                        <span className="rest__icons">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => openDeleteConfirmationRest(rest._id)} />
                                            <FontAwesomeIcon icon={faPencil} onClick={() => openEditModalRest(rest._id)} />
                                        </span>
                                    </span>
                                </li>
                            ))}
                    </ul>
                    <Button onClick={() => { openCreateModalRest() }}>Create Restaurant</Button>
                    <Modal open={editModalOpenRest} onClose={closeEditModalRest}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                <FormControl>
                                    <InputLabel shrink>Name</InputLabel>
                                    <TextField
                                        value={restDataEdit.name}
                                        onChange={(event) => handleInputChangeRest(event, "name")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Description</InputLabel>
                                    <TextField
                                        value={restDataEdit.description}
                                        onChange={(event) => handleInputChangeRest(event, "description")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Address</InputLabel>
                                    <TextField
                                        value={restDataEdit.address}
                                        onChange={(event) => handleInputChangeRest(event, "address")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Phone</InputLabel>
                                    <TextField
                                        value={restDataEdit.phone}
                                        onChange={(event) => handleInputChangeRest(event, "phone")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Email</InputLabel>
                                    <TextField
                                        value={restDataEdit.email}
                                        onChange={(event) => handleInputChangeRest(event, "email")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Rating</InputLabel>
                                    <TextField
                                        value={restDataEdit.rating}
                                        onChange={(event) => handleInputChangeRest(event, "rating")}
                                        required
                                    />
                                </FormControl>

                                {restDataEdit.photos?.map((photo, index) => (
                                    <div key={photo} className='ingredient__wrappper'>
                                        <FormControl>
                                            <InputLabel shrink>{`Photo ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Photo ${index + 1} Name`}
                                                value={photo}
                                                onChange={(event) => handlePhotoChangeEdit(event, index)}
                                                required
                                            />
                                        </FormControl>
                                        <Button onClick={(event) => deletePhotoEdit(event, index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addPhotoEdit}>
                                    Add Photo
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmEditRest}>
                                    Change
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => closeEditModalRest()}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal open={createModalOpenRest} onClose={closeCreateModalRest}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                <FormControl>
                                    <InputLabel shrink>Name</InputLabel>
                                    <TextField
                                        value={restDataEdit.name}
                                        onChange={(event) => handleInputChangeRestCreate(event, "name")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Description</InputLabel>
                                    <TextField
                                        value={restDataEdit.description}
                                        onChange={(event) => handleInputChangeRestCreate(event, "description")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Address</InputLabel>
                                    <TextField
                                        value={restDataEdit.address}
                                        onChange={(event) => handleInputChangeRestCreate(event, "address")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Phone</InputLabel>
                                    <TextField
                                        value={restDataEdit.phone}
                                        onChange={(event) => handleInputChangeRestCreate(event, "phone")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Email</InputLabel>
                                    <TextField
                                        value={restDataEdit.email}
                                        onChange={(event) => handleInputChangeRestCreate(event, "email")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Rating</InputLabel>
                                    <TextField
                                        value={restDataEdit.rating}
                                        onChange={(event) => handleInputChangeRestCreate(event, "rating")}
                                        required
                                    />
                                </FormControl>
                                <Select value={createRestDish} onChange={(event) => setCreateRestDish(event.target.value)}>
                                    {dishOptions}
                                </Select>
                                <Select value={createRestTable} onChange={(event) => setCreateRestTable(event.target.value)}>
                                    {tableOptions}
                                </Select>

                                {restDataCreate.photos.length > 0 && restDataCreate.photos.map((photo, index) => (
                                    <div key={photo} className='ingredient__wrappper'>
                                        <FormControl>
                                            <InputLabel shrink>{`Photo ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Photo ${index + 1} Name`}
                                                value={photo}
                                                onChange={(event) => handlePhotoChangeCreate(event, index)}
                                                required
                                            />
                                        </FormControl>
                                        <Button onClick={(event) => deletePhotoCreate(event, index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addPhotoCreate}>
                                    Add Photo
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmCreateRest}>
                                    Create
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => closeCreateModalRest()}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Dialog open={deleteConfirmationOpenRest} onClose={closeDeleteConfirmationRest}>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this restaurant?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDeleteConfirmationRest} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDeleteRest} color="primary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </TabPanel>
            <TabPanel value={value} index={3}>
                <div>
                    <ul className="rest__list">
                        {tables &&
                            tables.map((table, index) => (
                                <li key={table._id}>
                                    <span className="rest__title">
                                        Стіл {index + 1} Місць - {table.capacity} {'  '}
                                        <span className="rest__icons">
                                            <FontAwesomeIcon icon={faTrash} onClick={() => openDeleteConfirmationTable(table._id)} />
                                            <FontAwesomeIcon icon={faPencil} onClick={() => openEditModalTable(table._id)} />
                                        </span>
                                    </span>
                                    <ul>
                                        {table.tableNumbers.map((smallTable) => (
                                            <li>
                                                Номер столу {smallTable.number}
                                                <ul>
                                                    {smallTable.unavailableDates && smallTable.unavailableDates.map((unDate) => (
                                                        <p>{unDate}</p>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                    </ul>
                    <Button onClick={() => { openCreateModalTable() }}>Create Table</Button>
                    <Modal open={editModalOpenTable} onClose={closeEditModalTable}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                <FormControl>
                                    <InputLabel shrink>Id</InputLabel>
                                    <TextField
                                        disabled
                                        value={tableDataEdit._id}
                                        onChange={(event) => handleInputChangeTable(event, "_id")}
                                        required
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel shrink>Capacity</InputLabel>
                                    <TextField
                                        value={tableDataEdit.capacity}
                                        onChange={(event) => handleInputChangeTable(event, "capacity")}
                                        required
                                    />
                                </FormControl>

                                <FormControl>
                                    <InputLabel shrink>Created At</InputLabel>
                                    <TextField
                                        disabled
                                        value={tableDataEdit.createdAt}
                                        onChange={(event) => handleInputChangeTable(event, "createdAt")}
                                        required
                                    />
                                </FormControl>

                                {tableDataEdit.tableNumbers?.map((smallTable, index) => (
                                    <div key={smallTable._id} className='ingredient__wrappper'>
                                        {/* <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Table ${index + 1} Id`}
                                                value={smallTable._id}
                                                onChange={(event) => handleTableChangeTable(event, index, "_id")}
                                                required
                                            />
                                        </FormControl> */}

                                        <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Number`}</InputLabel>
                                            <TextField
                                                type="number"
                                                label={`Table ${index + 1} Number`}
                                                value={smallTable.number}
                                                onChange={(event) => handleTableChangeTable(event, index, "number")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Dates`}</InputLabel>
                                            {smallTable.unavailableDates?.map((tableDate, dateIndex) => (
                                                <TextField
                                                    key={dateIndex}
                                                    label={`Table ${index + 1} Date`}
                                                    value={tableDate}
                                                    // onChange={...}
                                                    required
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    onClick={() => deleteDate(index, dateIndex)}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            ))}
                                        </FormControl>
                                        <Button onClick={() => deleteSmallTable(index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addSmallTable}>
                                    Add Table
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmEditTable}>
                                    Change
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => closeEditModalTable()}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal open={createModalOpenTable} onClose={closeCreateModalTable}>
                        <div className="modal__content__edit">
                            <div className="modal__edit">
                                {/* <FormControl>
                                    <InputLabel shrink>Id</InputLabel>
                                    <TextField
                                        disabled
                                        value={tableDataEdit._id}
                                        onChange={(event) => handleInputChangeTable(event, "_id")}
                                        required
                                    />
                                </FormControl> */}
                                <Select value={createTableRestaurant} onChange={(event) => setCreateTableRestaurant(event.target.value)}>
                                    {restOptionsTable}
                                </Select>
                                <FormControl>
                                    <InputLabel shrink>Capacity</InputLabel>
                                    <TextField
                                        value={tableDataEdit.capacity}
                                        onChange={(event) => handleInputChangeTableCreate(event, "capacity")}
                                        required
                                    />
                                </FormControl>

                                {/* <FormControl>
                                    <InputLabel shrink>Created At</InputLabel>
                                    <TextField
                                        disabled
                                        value={tableDataEdit.createdAt}
                                        onChange={(event) => handleInputChangeTableCreate(event, "createdAt")}
                                        required
                                    />
                                </FormControl> */}

                                {tableDataCreate.tableNumbers?.map((smallTable, index) => (
                                    <div key={smallTable._id} className='ingredient__wrappper'>
                                        {/* <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Name`}</InputLabel>
                                            <TextField
                                                label={`Table ${index + 1} Id`}
                                                value={smallTable._id}
                                                onChange={(event) => handleTableChangeTableCreate(event, index, "_id")}
                                                required
                                            />
                                        </FormControl> */}

                                        <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Number`}</InputLabel>
                                            <TextField
                                                type="number"
                                                label={`Table ${index + 1} Number`}
                                                value={smallTable.number}
                                                onChange={(event) => handleTableChangeTableCreate(event, index, "number")}
                                                required
                                            />
                                        </FormControl>

                                        <FormControl>
                                            <InputLabel shrink>{`Table ${index + 1} Dates`}</InputLabel>
                                            {smallTable.unavailableDates?.map((tableDate, dateIndex) => (
                                                <TextField
                                                    key={dateIndex}
                                                    label={`Table ${index + 1} Date`}
                                                    value={tableDate}
                                                    // onChange={...}
                                                    required
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    onClick={() => deleteDateCreate(index, dateIndex)}
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            ))}
                                        </FormControl>
                                        <Button onClick={() => deleteSmallTableCreate(index)}><FontAwesomeIcon icon={faTrash} /></Button>
                                    </div>
                                ))}

                                <Button variant="contained" color="primary" onClick={addSmallTableCreate}>
                                    Add Table
                                </Button>

                                <Button variant="contained" color="primary" onClick={confirmCreateTable}>
                                    Create
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => closeCreateModalTable()}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal>
                    <Dialog open={deleteConfirmationOpenTable} onClose={closeDeleteConfirmationTable}>
                        <DialogTitle>Confirmation</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this restaurant?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDeleteConfirmationTable} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={confirmDeleteTable} color="primary" autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </TabPanel>
        </>
    );
}

export default AdminPage;
