const express = require('express');
const app = express();
const issueRouter = require("./routes/issueRoutes");
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

require('dotenv').config();
const dbConnect = require('./config/db');
const { authenticate } = require('./middlewares/authMiddleware');

dbConnect();
app.use(cors());
app.use(express.json());

app.use('/issues', authenticate, issueRouter);
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Issue Tracker Backend Running ✅");
});

const port = 8000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});