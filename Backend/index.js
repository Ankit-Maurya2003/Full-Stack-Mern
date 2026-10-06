import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes.js";


import User from "./routes/user.js";
import routes from "./routes/route.js";
import category from "./routes/category.js";
import product from "./routes/product.js";


import { connectDB } from "./database/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", routes);

app.use("/users", User);
app.use("/category", category);
app.use("/product", product);
app.use("/order", orderRoutes);

const port = process.env.PORT;

console.log("PORT:", port);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});