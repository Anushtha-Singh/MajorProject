const express = require('express');
const cors = require('cors');
require('dotenv').config();


const schemesRoutes = require('./routes/schemes');
const testRoutes = require('./routes/test')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', schemesRoutes);
app.use('/api', testRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
