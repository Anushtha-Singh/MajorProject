const express = require('express');
const cors = require('cors');
require('dotenv').config();

const liveschemesRouter = require('./routes/liveschemes');
const schemesRoutes = require('./routes/schemes');
const testRoutes = require('./routes/test')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', testRoutes);
app.use('/api', schemesRoutes);
app.use('/liveschemes', liveschemesRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
