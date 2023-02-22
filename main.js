import './style.css'
let cart = [];
let cartCounter = 0;

async function getJSON(url) {
  let rawData = await fetch(url);
  let data = await rawData.json();

  return data;
}

function setupEventListeners(books) {
      // add event listener to each detail button
      const cartButtons = document.querySelectorAll('.cart-btn');
      for (let i = 0; i < cartButtons.length; i++) {
        const book = books[i];
        cartButtons[i].addEventListener('click', () => {
          addtoCart(book);
        });
      }
  
      document.querySelector('.filterbar').addEventListener('change', async event => {
        let selectedOption = event.target.options[event.target.selectedIndex]
        let filterLabel= selectedOption.parentNode.label;
        let selectedFilter = event.target.value;

        //new copy of book array to be able to filter more than once
        let newBooks = await getJSON('/bookdata.json');
        if (selectedFilter === 'all') {
          populateMainPage(newBooks);
        } else if (filterLabel === 'Categories') {
          let booksWithCategory = doFilterCategory(newBooks, selectedFilter)
          populateMainPage(booksWithCategory);
        } else if (filterLabel === 'Authors') {
          let booksWithCategory = doFilterAuthor(newBooks, selectedFilter)
          populateMainPage(booksWithCategory);
        } else if (filterLabel === 'Price Interval') {
          let booksWithCategory = doFilterPrice(newBooks, selectedFilter)
          populateMainPage(booksWithCategory);
        }
      })
  
      //Handle sorts
      const titleAscBtn = document.querySelector('.sort-title-asc-btn');
      const titleDescBtn = document.querySelector('.sort-title-desc-btn');
      const priceAscBtn = document.querySelector('.sort-price-asc-btn');
      const priceDescBtn = document.querySelector('.sort-price-desc-btn');
      const authorAscBtn = document.querySelector('.sort-author-asc-btn');
      const authorDescBtn = document.querySelector('.sort-author-desc-btn');
    
      document.querySelector('.sort-price-asc-btn').addEventListener('click', event => {
        priceAscBtn.classList.add('active');
        // remove active class from other buttons
        titleDescBtn.classList.remove('active');
        titleAscBtn.classList.remove('active');
        priceDescBtn.classList.remove('active');
        authorAscBtn.classList.remove('active');
        authorDescBtn.classList.remove('active');
        let sortedBooks = sortByPriceAsc(books);
        populateMainPage(sortedBooks);
      })
    
      document.querySelector('.sort-price-desc-btn').addEventListener('click', event => {
        priceDescBtn.classList.add('active');
        // remove active class from other buttons
        titleDescBtn.classList.remove('active');
        titleAscBtn.classList.remove('active');
        priceAscBtn.classList.remove('active');
        authorAscBtn.classList.remove('active');
        authorDescBtn.classList.remove('active');
        let sortedBooks = sortByPriceDesc(books);
        populateMainPage(sortedBooks);
      })
    
      document.querySelector('.sort-title-asc-btn').addEventListener('click', event => {
        titleAscBtn.classList.add('active');
        // remove active class from other buttons
        titleDescBtn.classList.remove('active');
        priceAscBtn.classList.remove('active');
        priceDescBtn.classList.remove('active');
        authorAscBtn.classList.remove('active');
        authorDescBtn.classList.remove('active');
        let sortedBooks = sortByTitleAsc(books);
        populateMainPage(sortedBooks);
      })
      document.querySelector('.sort-title-desc-btn').addEventListener('click', event => {
        titleDescBtn.classList.add('active');
        // remove active class from other buttons
        titleAscBtn.classList.remove('active');
        priceAscBtn.classList.remove('active');
        priceDescBtn.classList.remove('active');
        authorAscBtn.classList.remove('active');
        authorDescBtn.classList.remove('active');
        let sortedBooks = sortByTitleDesc(books);
        populateMainPage(sortedBooks);
      })
    
      document.querySelector('.sort-author-asc-btn').addEventListener('click', event => {
        authorAscBtn.classList.add('active');
        // remove active class from other buttons
        titleDescBtn.classList.remove('active');
        titleAscBtn.classList.remove('active');
        priceAscBtn.classList.remove('active');
        priceDescBtn.classList.remove('active');
        authorDescBtn.classList.remove('active');
        let sortedBooks = sortByAuthorAsc(books);
        populateMainPage(sortedBooks);
      })
    
      document.querySelector('.sort-author-desc-btn').addEventListener('click', event => {
        authorDescBtn.classList.add('active');
        // remove active class from other buttons
        titleDescBtn.classList.remove('active');
        titleAscBtn.classList.remove('active')
        priceAscBtn.classList.remove('active');
        priceDescBtn.classList.remove('active');
        authorAscBtn.classList.remove('active');
    
        let sortedBooks = sortByAuthorDesc(books);
        populateMainPage(sortedBooks);
      })
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
  //update cart counter
  document.querySelector(".navbar-cart").innerHTML = `<i class="bi bi-cart">${--cartCounter}</i>`;
  
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
    html += '<div class="col-sm-3" id="tablerow">';
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
}

function showFilters(books) {
  let categories = getCategories(books);
  let authors = getAuthors(books);

  let html = '';
  html += `<div class="col-sm-12">`
  html += `<div class="col-sm-8"><i class="bi bi-filter"></i></div>`
  html += `<div class="col-sm-11">` 
  html += `<label class="col-sm-4">Filters:`;
  html += `<select class="filterbar" id="filterbar">`;
  html += `<option>all</option>`;
  html += `<optgroup label ="Categories">`
  html += `${categories.map(category => `<option>${category}</option>`).join('')}`;
  html += `<optgroup label ="Authors">`
  html += `${authors.map(author => `<option>${author}</option>`).join('')}`;
  html += `</optgroup>`
  html += `<optgroup label ="Price Interval">`
  html += `<option>0 - 100</option>`;
  html += `<option>100 - 200</option>`;
  html += `<option>200 - 300</option>`;
  html += `<option>300 - 400</option>`;
  html += `</optgroup>`
  html += `</select>`;
  html += `</label>`;
  html += `</div>`;
  html += `<div class="col-sm-11">` 
  html += `<a>Sorts:</a>`
  html += `<button class="btn btn-outline-dark sort-title-asc-btn"> Title Asc </button>`;
  html += `<button class="btn btn-outline-dark sort-title-desc-btn"> Title Desc</button>`;
  html += `<button class="btn btn-outline-dark sort-price-asc-btn"> Price Asc </button>`;
  html += `<button class="btn btn-outline-dark sort-price-desc-btn"> Price Desc </button>`;
  html += `<button class="btn btn-outline-dark sort-author-asc-btn"> Author Asc </button>`;
  html += `<button class="btn btn-outline-dark sort-author-desc-btn"> Author Desc </button> `;
  html += `</div>`;
  html += `</div>`;

  document.querySelector('.filters').innerHTML = html;
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

function doFilterCategory(books, filter) {
  let newBooks = books.filter((book) => {
    return book.category === filter;
  })  
  return newBooks;
}

function doFilterAuthor(books, filter) {
  let newBooks = books.filter((book) => {
    return book.author === filter;
  })  
  return newBooks;
}

function doFilterPrice(books, filter) {
  const parts = filter.split('-');
  let lower = parts[0].trim();
  let upper = parts[1].trim();
  let newBooks = books.filter((book) => {
    return book.price >= lower && book.price <= upper;
  })  

  return newBooks;
}

function sortByPriceAsc(books) {
  return books.sort((a, b) => a.price - b.price);
}
function sortByPriceDesc(books) {
  return books.sort((a, b) =>  b.price - a.price);
}

function sortByTitleAsc(books, sortBy) {
  const sortedArr = books.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
}

function sortByTitleDesc(books, sortBy) {
  const sortedArr = books.sort((a, b) => {
    if (a.title > b.title) {
      return -1;
    }
    if (a.title < b.title) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
}

function sortByAuthorAsc(books, sortBy) {
  const sortedArr = books.sort((a, b) => {
    if (a.author < b.author) {
      return -1;
    }
    if (a.author > b.author) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
}

function sortByAuthorDesc(books, sortBy) {
  const sortedArr = books.sort((a, b) => {
    if (a.author> b.author) {
      return -1;
    }
    if (a.author < b.author) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
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
  document.querySelector(".navbar-cart").innerHTML = `<i class="bi bi-cart">${++cartCounter}</i>`;
}


async function start() {
  let books = await getJSON('/bookdata.json');
  showFilters(books);
  populateMainPage(books);

  document.querySelector(".navbar-cart").addEventListener('click', event => {
    openCartModal(cart);
  })

  setupEventListeners(books);
  
}

start();