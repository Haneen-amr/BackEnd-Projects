const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
console.log("DB_URI from env:", process.env.DB_URI);
console.log("API_URL:", process.env.API_URL);

const express = require('express');
const app = express();
app.use(express.json()); //for parsing
app.use(express.urlencoded({ extended: true }));

const morgan = require("morgan"); //for process logging
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
    console.log(`node: ${process.env.NODE_ENV}`);
}

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authJwt = require("./utils/jwt");
app.use(authJwt());

const mongoose = require("mongoose"); 
mongoose.connect(process.env.DB_URI)
    .then((conn) => {
        console.log(`Database Connected: ${conn.connection.host}`);
    })
    .catch((error) => {
        console.error("Database Error: ", error);
        process.exit(1);
    });

app.use(express.static(path.join(__dirname, 'public')));
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5000', // Allow frontend origin
    credentials: false // Set to true only if using cookies
}));


const usersRouter = require("./routes/Users");
const logging = require("./middlewares/LoggingMW");
const errorMW = require("./middlewares/ErrorMW");
const adminRouter = require('./routes/Admin');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Categories');
const ordersRouter = require('./routes/Order');
const cartRouter = require('./routes/Cart');


app.use(logging);
app.use(`${process.env.API_URL}/users`, usersRouter);
app.use(`${process.env.API_URL}/admin`, adminRouter);
app.use(`${process.env.API_URL}/products`, productsRouter);
app.use(`${process.env.API_URL}/categories`, categoriesRouter);
app.use(`${process.env.API_URL}/orders`, ordersRouter);
app.use(`${process.env.API_URL}/cart`, cartRouter);
app.use(errorMW);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


module.exports = app;
