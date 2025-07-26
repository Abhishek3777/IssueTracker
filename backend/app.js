const express = require('express');
const app = express();
const issueRouter = require("./routes/issueRoutes");
const cors = require('cors');

require('dotenv').config();
const dbConnect = require('./config/db');

dbConnect();
app.use(cors());
app.use(express.json());

app.use('/issues', issueRouter);


app.get("/", (req, res) => {
  res.send("Issue Tracker Backend Running ✅");
});

const port = 8000;
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});