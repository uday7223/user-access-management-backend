const express = require("express");
const AppDataSource = require("./data-source");
const authRoutes = require("./routes/authRoutes");
const softwareRoutes = require("./routes/softwareRoutes");
const requestRoutes = require("./routes/requestRoutes");


require("dotenv").config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/requests", requestRoutes);

// Add other route files like softwareRoutes, requestRoutes...

AppDataSource.initialize().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});
