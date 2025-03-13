const express = require('express');
const cors = require('cors');
require('dotenv').config();
const handwritingRouter = require('./recognize-handwriting');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(handwritingRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 