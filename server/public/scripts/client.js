$(document).ready(function () {
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
  $('#bookShelf').on('click', '.bookRead', bookRead)
  $('#bookShelf').on('click', '#deleteBtn', deleteTheBook)
  
});
let books = []

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  // TODO - Add code for edit & delete buttons
}

function deleteTheBook() {
  console.log($(this))
  const bookID = $(this).closest('tr').data('id')
  $.ajax({
    type: 'DELETE',
    url: `/books/${bookID}`,
  }).then(function (response) {
    console.log('😆');
    refreshBooks();

  }).catch(function(error){
    console.log('Error in delete', error);
});
} //end Delete
  
  // let id = $(this).closest('tr').data('id');
  // let isTransfered = $(this).closest('tr').data('ready');

  // if (isTransfered === true || isTransfered === null) {
  //   isTransfered = false;
  // } else if (isTransfered === false) {
  //   isTransfered = true;
  // }

function bookRead() {
  $.ajax({
    url: `/books/bookread/${$(this).parents('tr').data('id')}`,
    type: 'PUT',
  }).then(function (response) {
    refreshBooks(); //refresh book list 
  }).catch(function (error) {
    console.log('error in PUT', error);
  });

}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
  }).then(function (response) {
    console.log('Response from server.', response);
    refreshBooks(bookToAdd)
  }).catch(function (error) {
    console.log('Error in POST', error)
    alert('Unable to add book at this time. Please try again later.');
  });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function (response) {
    console.log(response);
    renderBooks(response);
  }).catch(function (error) {
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
      <tr data-id=${books.id}>
        <td>${book.title}</td>
        <td>${book.author}</td>
         <td><button class="bookRead">${book.isRead ? 'Have Read' : 'Needs Reading' }</button></td>
        <td><button id="deleteBtn">Delete</button></td>
      </tr>
    `);
  }
}
