/* import and initialize express app */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
require('dotenv').config();


/* this middleware deals with CORS errors and allows the client on port 5173 to access the server */
/* morgan is a logging library that allows us to see the requests being made to the server */

const client = 
new pg.Client(process.env.DATABASE_URL 
  || 'postgres://localhost/acme_project');

const app = express();


/* set up express middleware */
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
    console.error('Database connection error', err);
    process.exit(1); 
  });



/* set up intial hello world route */
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


/* set up api route */
app.get('/employees', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * from employees;
                `
      const response = await client.query(SQL)
      res.send(response.rows)
      } catch(ex) {
        next(ex)

      }
  }  )

/* our middleware won't capture 404 errors, so we're setting up a separate error handler for those*/
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

/* initialize server (listen) */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});