import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    data:{
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

export default mongoose.model("order",orderSchema);