import Order from "../models/OrderModel.js"

export const makeOrder =  async (req, res, next) => {
    try {
      const order = new Order(req.body);
      const saveOrder = await order.save();
      res.status(200).json(saveOrder);
    } catch (err) {
      next(err);
    }
  };
  
  export const getOrders = async (req,res,next) =>{
    try {
      const orders = await Order.find().populate('user') .populate({
        path: 'dishes.dish_id',
        model: 'Dish'
      }).exec();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };