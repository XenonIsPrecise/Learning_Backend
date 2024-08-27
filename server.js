const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');



const bootcamps = require("./routes/bootcamps");
// const logger = require('./middleware/logger');
// Load environment variables
dotenv.config({path: './config/config.env'});
// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use("/api/v1/bootcamps",bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 3000; // Default port is 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

