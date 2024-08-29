const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');

// Load environment variables 
dotenv.config({path: './config/config.env'});
// Connect to database
connectDB();



// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");


const app = express();

// Body parser
app.use(express.json());


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/v1/bootcamps",bootcamps);
app.use("/api/v1/courses",courses);

app.use(errorHandler);

const PORT = process.env.PORT || 3000; // Default port is 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

