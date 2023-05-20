import mongoose from "mongoose";

const orderSchema = new mongoose.Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    date:{
       type:Date,
    },
    total_price:Number,
    dishes:[
      {
        dish_id:{
            type:String
        },
        count:{
            type:Number
        }
      }
    ]
})

export default mongoose.model("Order",orderSchema);