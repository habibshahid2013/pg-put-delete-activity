const express = require('express');
const bookRouter = express.Router();
const pg = require('pg');
const bodyParser = require('body-parser');

const app = express();
const pool = require('../modules/pool');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all books
bookRouter.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText)
      .then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
    .catch(error => {
      console.log('error getting books', error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
bookRouter.post('/', (req, res) => {
    let newBook = req.body;
    console.log(`Adding book`, newBook);

    let queryText = `INSERT INTO "books" ("author", "title")
                    VALUES ($1, $2);`;
    pool.query(queryText, [newBook.author, newBook.title])
        .then(result => {
        res.sendStatus(201);
      })
      .catch(error => {
        console.log(`Error adding new book`, error);
        res.sendStatus(500);
      });
  });

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status

bookRouter.put('/book-read/:id', (req, res) => {
  // console.log('params', req.params);
  console.log('ready param', req.params.id);
  // let ready = req.params.ready;
  // console.log('ready variable check', ready);
  let sqlQuery = `
   UPDATE "books" SET "isRead" = NOT "isRead" WHERE "id" = $1
  `;

  let sqlParams = [ req.params.id] //$1

  console.log('What is this', sqlParams);
  
  pool.query(sqlQuery, sqlParams)
      .then((dbRes) => {
      res.send(201);
    })
      .catch((err) => {
        console.log("post error", err);
      res.sendStatus(500);
    });
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
bookRouter.delete('/:id', (req, res) => {
    const idToDelete = req.params.id
    let sqlQuery = 'DELETE FROM "books" WHERE id=$1;'
    let sqlParams = [idToDelete]
    pool.query(sqlQuery, sqlParams)
      .then((dbRes) => {
        res.sendStatus(200)

      })
      .catch((err) => {
        console.log('DELETE error', err);
        res.sendStatus(200)
      })
  })

  module.exports = bookRouter;
