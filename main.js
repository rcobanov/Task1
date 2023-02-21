import './style.css'
let cart = [];


async function getJSON(url) {
  let rawData = await fetch(url);
  let data = await rawData.json();

  return data;
}

function deleteRowFromCart(row) {
  const modal = document.querySelector('.modal');
  //make changes to qty or remove modal
  if (row.qty > 1) {
    row.qty--;
  } else {
    cart = cart.filter((data) => {
      return data.title !== row.title;
    })
  }
  //remove the modal and open it again
  modal.remove();
  openCartModal(cart);
}


function openCartModal(cart) {
  const totalPrice = getTotalFromCart();
  let modalHtml = ''
  modalHtml += `<div class="modal">`
  modalHtml += `<div class="modal-dialog modal-lg">`
  modalHtml += `<div class="modal-content">`
  modalHtml += `<button type="button" class="btn-close float-end close-modal" aria-label="Close"></button>`
  modalHtml += `<p>Cart</p>`
  modalHtml += '<table id="table" class="table table-striped" style ="margin: 0px auto;">'
  modalHtml += `<th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Row Total</th>
                <th></th>`
  modalHtml += `${cart.map(book => `<tr>
               <td>${book.title}</td>
               <td>${book.price}.00$</td>
               <td>${book.qty}</td>
               <td>${book.price * book.qty}.00$</td>
               <td><button class="btn btn-outline-dark w-10 bi bi-trash modal-delete-btn"></button></td>
               </tr>
               </option>`).join('')}`;
  modalHtml += `<tr>
                <td><td>
                <td></td>
                <td>Total: ${totalPrice}.00$</td>
                <td></td>
                </tr>`
  modalHtml += `</table>`
  modalHtml += `</div>`
  modalHtml += `</div>`
  modalHtml += `</div>`
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // add event listener to each detail button
  const deleteButtons = document.querySelectorAll('.modal-delete-btn');
  for (let i = 0; i < deleteButtons.length; i++) {
    const row = cart[i];
    deleteButtons[i].addEventListener('click', () => {
      deleteRowFromCart(row);
    });
  }

    const modal = document.querySelector('.modal');
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }



function openModal(book) {
  console.log('Im clicked ' + book.title);
  let modalHtml = ''
  modalHtml += `<div class="modal">`
  modalHtml += `<div class="modal-dialog modal-lg">`
  modalHtml += `<div class="modal-content">`
  modalHtml += `<button type="button" class="btn-close float-end close" aria-label="Close"></button>`
  modalHtml += '<img src="./images/dummy.jpg" class="rounded mx-auto d-block">'
  modalHtml += `<div> Price: ${book.price}$ </div>` 
  modalHtml += `<div class="booktitle"> ${book.title} </div>`
  modalHtml += `<div class="description"> ${book.description} </div>`
  modalHtml += `<div class="author"> ${book.author} </div>`
  modalHtml += `<div> <button class="btn btn-outline-dark w-90 modal-cart-btn"> Add to Cart </button> </div>`
  modalHtml += `</div>`
  modalHtml += `</div>`
  modalHtml += `</div>`
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.querySelector('.modal');

  //create deleteButton listener
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  //create add to cart button listener
  const addBtn = modal.querySelector('.modal-cart-btn');
  addBtn.addEventListener('click', () => {
    addtoCart(book)
    modal.remove();
  })
}

function populateMainPage(books) {
  let html = '';

  html += '<div class="row">'
  for (let book of books) {
    html += '<div class="col-sm-2">';
    html += '<img src="./images/dummy.jpg" >';
    html += `<div> Price: ${book.price}$ </div>`;
    html += `<div class="booktitle"> ${book.title} </div>`;
    html += `<div class="author"> ${book.author} </div>`;
    html += `<div class="category"> ${book.category} </div>`;
    html += `<div class="buttons">`;
    html += `<button class="btn btn-outline-dark w-100 details-btn"> Details </button>`;
    html += `<button class="btn btn-outline-dark w-100 cart-btn"> Add to Cart </button>`;
    html += `</div>`;
    html += '</div>';
  }
  html += '</div>';
  document.querySelector('.books').innerHTML = html;


  // add event listener to each detail button
  const detailsButtons = document.querySelectorAll('.details-btn');
  for (let i = 0; i < detailsButtons.length; i++) {
    const book = books[i];
    detailsButtons[i].addEventListener('click', () => {
      openModal(book);
    });
  }

    // add event listener to each detail button
    const cartButtons = document.querySelectorAll('.cart-btn');
    for (let i = 0; i < cartButtons.length; i++) {
      const book = books[i];
      cartButtons[i].addEventListener('click', () => {
        addtoCart(book);
      });
    }
  
}

function showFilters(books) {
  let categories = getCategories(books);
  let authors = getAuthors(books);

  let html = '';
  html += `<label> Filter:`;
  html += `<select class="categoryFilter">`;
  html += `<option>all</option>`;
  html += `${categories.map(category => `<option>${category}</option>`).join('')}`;
  html += `${authors.map(author => `<option>${author}</option>`).join('')}`;
  html += `</select>`;
  html += `</label>`;

  document.querySelector('.filters').innerHTML = html;

  //event listener

  document.querySelector('.categoryFilter').addEventListener('change', event => {
    console.log(event.target.value)
    let selectedCategory = event.target.value;
    let booksWithCategory = doFilter(books, selectedCategory)
    if (selectedCategory === 'all') {
      populateMainPage(books);
    } else {
      populateMainPage(booksWithCategory);
    }
  })

}

function getTotalFromCart() {
  let totalPrice = 0;
  cart.forEach(element => {
    totalPrice += element.price*element.qty;
  });
  return totalPrice;
}

function getCategories(books) {
  let withDuplicates = books.map(book => book.category);
  return [... new Set(withDuplicates)];
}
function getAuthors(books) {
  let withDuplicates = books.map(book => book.author);
  return [... new Set(withDuplicates)];
}

function doFilter(books, filter) {
  let newBooks = books.filter((book) => {
    return book.category === filter;
  })  
  return newBooks;
}

function addtoCart(book) {
//increment qty if same title is added
  if (cart.find(e => e.title === book.title)) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].title === book.title) {
        cart[i].qty++;
        break;
      }
    }
  } else { // else push it to cart array
    cart.push({ title: book.title, qty: 1, price: book.price })
  }
}


async function start() {
  let books = await getJSON('/bookdata.json');
  showFilters(books)
  populateMainPage(books);

  document.querySelector(".navbar-cart").addEventListener('click', event => {
    console.log(cart)
    openCartModal(cart);
  })
  
}

start();