require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const jobsRouter = require("./routes/jobs");
const applicationsRouter = require("./routes/applications");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRouter);
app.use("/api/applications", applicationsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Job Radar API running on http://localhost:${PORT}`);
  });
});
