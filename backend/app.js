import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sequelize } from "./config/config.js";
import { setupAssociations } from "./models/associations.js";
import { authRoutes } from "./routes/authRoutes.js";
import { jobRoutes } from "./routes/jobRoutes.js";
import { myjobRoutes } from "./routes/myjobRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";


const app = express();

const corsOptions = {
  origin: "http://localhost:5000",
  credentials: true, // Important for cookies
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

setupAssociations();

app.use("/api/jobs", jobRoutes);
app.use("/api/my-jobs", myjobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((error) => console.error("Error syncing database:", error));
