import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import UserRoutes from "./routes/UserRoutes.js";
import Handlers from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PARAMS = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};
const URI = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/user", UserRoutes);

app.use(Handlers.notfound);
app.use(Handlers.errorHandler);

mongoose.set("strictQuery", false);
mongoose.connect(URI, PARAMS)
    .then(() => app.listen(PORT, 
        () => console.info(`Server running on PORT ${PORT} 🔥`)))
    .catch((err) => console.error(err.message));
