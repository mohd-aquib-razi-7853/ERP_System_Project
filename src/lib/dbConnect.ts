import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL!,{dbName:"erp_system"});
    if (!connect) throw new Error();
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};

export default dbConnect;