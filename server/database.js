import mongoose from "mongoose";

const URI = "mongodb://0.0.0.0:27017/dhi";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);
    console.log("DB is connected", conn.connection.host);
  } catch (error) {
    console.log(error);
  }
};
