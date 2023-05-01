import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
/*
{
"name": "John Doe",
"phone": "380996331496",
"email": "johndoe@example.com",
"password": "password123"
}
*/
