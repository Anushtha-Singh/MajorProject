const express = require('express');
const cors = require('cors');
require('dotenv').config();


const schemesRoutes = require('./routes/schemes');
const testRoutes = require('./routes/test')

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', testRoutes);
app.use('/api', schemesRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
