import './style.css'
let cart = [];
let cartCounter = 0;
let filteredBooks = [];
let selectedSortOption = '';
let selectedFilterOption = '';
let selectedFilterLabel = '';

async function getJSON(url) {
  let rawData = await fetch(url);
  let data = await rawData.json();

  return data;
}

function setupEventListenersCards() {
  // add event listener to each detail button
  const detailsButtons = document.querySelectorAll('.details-btn');
  for (let i = 0; i < detailsButtons.length; i++) {
    const book = filteredBooks[i];
    detailsButtons[i].addEventListener('click', () => {
      openModal(book);
    });
  }

  // add event listener to each detail button
  const cartButtons = document.querySelectorAll('.cart-btn');
  for (let i = 0; i < cartButtons.length; i++) {
    const book = filteredBooks[i];
    cartButtons[i].addEventListener('click', () => {
      addtoCart(book);
    });
  }

}

function setupEventListenersFilter() {
  document.querySelector('.filterbar').addEventListener('change', async event => {
    let selectedOption = event.target.options[event.target.selectedIndex]
    let filterLabel= selectedOption.parentNode.label;
    //new copy of book array to be able to filter more than once
    filteredBooks = await getJSON('/bookdata.json');

    selectedFilterOption = event.target.value;
    selectedFilterLabel = filterLabel;
    populateMainPage();
  })
  
    document.querySelector('.sortbar').addEventListener('change', async event => {
      selectedSortOption = event.target.value;
      populateMainPage();
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
  modalHtml += `<th>Item</th>
                <th>Row Total</th>
                <th></th>`
  modalHtml += `${cart.map(book => `<tr style="font-size: 12px;"> 
               <td><ul><li  style="font-weight: 700;">${book.title}</li><li>Price: ${book.price}.00$</li><li>Quantity: ${book.qty}</li></ul></td>
               <td>${book.price * book.qty}.00$</td>
               <td><button class="btn btn-outline-dark w-10 bi bi-trash modal-delete-btn"></button></td>
               </tr>
               </option>`).join('')}`;
  modalHtml += `<tr>
                <td><button type="button" class="btn btn-primary">Checkout</button><td>
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

function populateMainPage() {

      
  if (selectedFilterLabel === 'Categories') {
    doFilterCategory(selectedFilterOption)
  } else if (selectedFilterLabel === 'Authors') {
    doFilterAuthor(selectedFilterOption)
  } else if (selectedFilterLabel === 'Price Interval') {
    doFilterPrice(selectedFilterOption)
  }

  if (selectedSortOption === 'Recommended') {
    sortById();
  } else if (selectedSortOption === 'Title Asc') {
    sortByTitle('asc')
  }else if (selectedSortOption === 'Title Desc') {
    sortByTitle('desc')
  } else if (selectedSortOption === 'Price Asc') {
    sortByPrice('asc')
  } else if (selectedSortOption === 'Price Desc') {
    sortByPrice('desc')
  }  else if (selectedSortOption === 'Author Asc') {
    sortByAuthor('asc');
  } else if (selectedSortOption === 'Author Desc') {
    sortByAuthor('desc');
  }


  let html = '';
  html += '<div class="row">'
  for (let book of filteredBooks) {
    html += '<div class="col-sm-4 col-lg-3 cardview" id="tablerow">';
    html += '<img src="./images/dummy.jpg" >';
    html += `<div class="bookprice"> Price: ${book.price}$ </div>`;
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

  setupEventListenersCards();

}

function showFilters(books) {
  let categories = getCategories(books);
  let authors = getAuthors(books);

  let html = '';
  html += `<div class="col-sm-12">`
  html += `<div class="col-sm-8"><i class="bi bi-filter"></i></div>`
  html += `<div class="col-sm-11">` 
  html += `<label class="col-sm-4">Filters: `;
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
  html += `<label class="col-sm-4">Sorts: `;
  html += `<select class="sortbar" id="sortbar">`;
  html += `<option>Recommended</option>`;
  html += `<option>Title Asc</option>`;
  html += `<option>Title Desc</option>`;
  html += `<option>Price Asc</option>`;
  html += `<option>Price Desc</option>`;
  html += `<option>Author Asc</option>`;
  html += `<option>Author Desc</option>`;
  html += `</select>`;
  html += `</label>`;
  html += `</div>`;
  html += `</div>`;

  document.querySelector('.filters').innerHTML = html;

  setupEventListenersFilter()
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

function doFilterCategory(filter) {
  filteredBooks = filteredBooks.filter((book) => {
    return book.category === filter;
  }) 

}

function doFilterAuthor(filter) {
  filteredBooks = filteredBooks.filter((book) => {
    return book.author === filter;
  }) 
}

function doFilterPrice(filter) {
  const parts = filter.split('-');
  let lower = parts[0].trim();
  let upper = parts[1].trim();
  filteredBooks = filteredBooks.filter((book) => {
    return book.price >= lower && book.price <= upper;
  })  
}

function sortByPrice(order) {
  if (order === 'asc') {filteredBooks = filteredBooks.sort((a, b) => a.price - b.price)}
  if (order === 'desc'){filteredBooks = filteredBooks.sort((a, b) =>  b.price - a.price)}
}


function sortById() {
  filteredBooks = filteredBooks.sort((a, b) => a.id - b.id);
}



function sortByTitle(order) {
  if (order === 'asc') {
    filteredBooks.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  } else if (order === 'desc') {
    filteredBooks.sort((a, b) => {
      if (a.title > b.title) {
        return -1;
      }
      if (a.title < b.title) {
        return 1;
      }
      return 0;
    });
  }
}


function sortByAuthor(order) {
  if (order === 'asc') {
    filteredBooks.sort((a, b) => {
      if (a.author < b.author) {
        return -1;
      }
      if (a.author > b.author) {
        return 1;
      }
      return 0;
    });
  } else if (order === 'desc') {
    filteredBooks.sort((a, b) => {
      if (a.author> b.author) {
        return -1;
      }
      if (a.author < b.author) {
        return 1;
      }
      return 0;
    });
  }

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
  filteredBooks = books;
  showFilters(books);

  document.querySelector(".navbar-cart").addEventListener('click', event => {
    openCartModal(cart);
  });
  populateMainPage();
}

start();